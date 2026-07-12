<?php

namespace App\Modules\Newsletter;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Newsletter controller — NOT AbstractContentController.
 * Newsletter is a delivery/engagement domain.
 */
class NewsletterController extends Controller
{
    public function __construct(private NewsletterService $service) {}

    /** POST /api/v1/newsletter/subscribe — Public */
    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'email'      => 'required|email',
            'first_name' => 'nullable|string|max:100',
            'lists'      => 'nullable|array',
            'lists.*'    => 'string|exists:newsletter_lists,slug',
        ]);

        $subscriber = $this->service->subscribe(
            $data['email'],
            $data['first_name'] ?? null,
            $data['lists'] ?? []
        );

        return response()->json([
            'message' => 'Please check your email to confirm your subscription.',
            'status'  => $subscriber->status,
        ], 201);
    }

    /** GET /api/v1/newsletter/confirm/{token} — Public */
    public function confirm(string $token)
    {
        $confirmed = $this->service->confirm($token);
        return response()->json([
            'message' => $confirmed ? 'Subscription confirmed. Thank you!' : 'Invalid or expired token.',
        ], $confirmed ? 200 : 404);
    }

    /** GET /api/v1/newsletter/unsubscribe/{token} — Public */
    public function unsubscribe(string $token)
    {
        $done = $this->service->unsubscribe($token);
        return response()->json([
            'message' => $done ? 'You have been unsubscribed.' : 'Invalid token.',
        ], $done ? 200 : 404);
    }

    /** GET /api/v1/newsletter/lists — Public (show subscribe form options) */
    public function lists()
    {
        $lists = NewsletterList::where('is_public', true)->orderBy('sort_order')->get(['uuid', 'name', 'slug', 'description']);
        return response()->json($lists);
    }

    // ── Admin ──────────────────────────────────────────────────────────────────

    /** GET /api/v1/admin/newsletter/subscribers */
    public function subscribers(Request $request)
    {
        $subscribers = Subscriber::when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->list, fn($q, $l) => $q->whereHas('lists', fn($q2) => $q2->where('slug', $l)))
            ->when($request->search, fn($q, $s) => $q->where(fn($q2) =>
                $q2->where('email', 'like', "%{$s}%")
                   ->orWhere('first_name', 'like', "%{$s}%")
                   ->orWhere('last_name', 'like', "%{$s}%")
            ))
            ->with('lists')
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json($subscribers);
    }

    /** GET /api/v1/admin/newsletter/subscribers/{uuid} */
    public function showSubscriber(string $uuid)
    {
        $subscriber = Subscriber::where('uuid', $uuid)->with('lists')->firstOrFail();
        return response()->json($subscriber);
    }

    /** DELETE /api/v1/admin/newsletter/subscribers/{uuid} */
    public function destroySubscriber(string $uuid)
    {
        // newsletter_subscribers has no deleted_at column — this is a real
        // delete, not a soft-delete (no recoverability infrastructure exists
        // for this table, matching what's actually in the schema).
        $subscriber = Subscriber::where('uuid', $uuid)->firstOrFail();
        $subscriber->lists()->detach();
        $subscriber->delete();
        return response()->json(['message' => 'Subscriber deleted.']);
    }

    /** GET /api/v1/admin/newsletter/lists — all lists (including non-public), for campaign/segment pickers */
    public function adminLists()
    {
        return response()->json(NewsletterList::orderBy('name')->get());
    }

    /**
     * POST /api/v1/admin/newsletter/lists
     * "Segments" don't exist as a backend concept — NewsletterList (a static,
     * admin-managed group) is the only grouping mechanism. Minimal CRUD added
     * because campaigns require lists.min:1 and there was previously no way
     * to create one at all.
     */
    public function storeList(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:newsletter_lists,slug',
            'description' => 'nullable|string',
            'is_public'   => 'nullable|boolean',
            'is_default'  => 'nullable|boolean',
        ]);
        $data['created_by'] = $request->user()->id;
        $data['subscriber_count'] = 0;
        $list = NewsletterList::create($data);
        return response()->json($list, 201);
    }

    /** DELETE /api/v1/admin/newsletter/lists/{uuid} */
    public function destroyList(string $uuid)
    {
        $list = NewsletterList::where('uuid', $uuid)->firstOrFail();
        $list->subscribers()->detach();
        $list->campaigns()->detach();
        $list->delete();
        return response()->json(['message' => 'List deleted.']);
    }

    /** GET /api/v1/admin/newsletter/campaigns */
    public function campaigns(Request $request)
    {
        return response()->json(
            Campaign::with('lists')
                ->when($request->status, fn($q, $s) => $q->where('status', $s))
                ->when($request->search, fn($q, $s) => $q->where(fn($q2) =>
                    $q2->where('name', 'like', "%{$s}%")->orWhere('subject', 'like', "%{$s}%")
                ))
                ->orderByDesc('created_at')
                ->paginate(20)
        );
    }

    /** GET /api/v1/admin/newsletter/campaigns/{uuid} */
    public function showCampaign(string $uuid)
    {
        $campaign = Campaign::where('uuid', $uuid)->with('lists')->firstOrFail();
        return response()->json($campaign);
    }

    /** POST /api/v1/admin/newsletter/campaigns */
    public function storeCampaign(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string',
            'subject'      => 'required|string',
            'html_body'    => 'required|string',
            'plain_body'   => 'nullable|string',
            'preview_text' => 'nullable|string',
            'from_name'    => 'nullable|string',
            'from_email'   => 'nullable|email',
            'lists'        => 'required|array|min:1',
            'lists.*'      => 'string|exists:newsletter_lists,slug',
            'scheduled_at' => 'nullable|date|after:now',
        ]);
        $data['created_by'] = $request->user()->id;
        $campaign = Campaign::create($data);

        $listIds = NewsletterList::whereIn('slug', $data['lists'])->pluck('id');
        $campaign->lists()->attach($listIds);

        return response()->json($campaign->load('lists'), 201);
    }

    /** PUT /api/v1/admin/newsletter/campaigns/{uuid} — only while still a draft */
    public function updateCampaign(Request $request, string $uuid)
    {
        $campaign = Campaign::where('uuid', $uuid)->firstOrFail();
        if ($campaign->status !== 'draft') {
            return response()->json(['message' => 'Only draft campaigns can be edited.'], 422);
        }

        $data = $request->validate([
            'name'         => 'sometimes|string',
            'subject'      => 'sometimes|string',
            'html_body'    => 'sometimes|string',
            'plain_body'   => 'nullable|string',
            'preview_text' => 'nullable|string',
            'from_name'    => 'nullable|string',
            'from_email'   => 'nullable|email',
            'lists'        => 'sometimes|array|min:1',
            'lists.*'      => 'string|exists:newsletter_lists,slug',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $campaign->update(collect($data)->except('lists')->all());

        if (isset($data['lists'])) {
            $listIds = NewsletterList::whereIn('slug', $data['lists'])->pluck('id');
            $campaign->lists()->sync($listIds);
        }

        return response()->json($campaign->fresh('lists'));
    }

    /** DELETE /api/v1/admin/newsletter/campaigns/{uuid} — only while still a draft */
    public function destroyCampaign(string $uuid)
    {
        $campaign = Campaign::where('uuid', $uuid)->firstOrFail();
        if ($campaign->status !== 'draft') {
            return response()->json(['message' => 'Only draft campaigns can be deleted.'], 422);
        }
        $campaign->delete();
        return response()->json(['message' => 'Campaign deleted.']);
    }
}
