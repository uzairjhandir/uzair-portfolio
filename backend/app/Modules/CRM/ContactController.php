<?php

namespace App\Modules\Crm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * CRM Contact controller — NOT AbstractContentController.
 */
class ContactController extends Controller
{
    public function __construct(private ContactRepository $repository) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', CrmContact::class);
        return ContactResource::collection(
            $this->repository->paginate($request->only('status', 'stage', 'assigned_to', 'search'))
        );
    }

    public function show(string $uuid)
    {
        $contact = CrmContact::where('uuid', $uuid)->withCount('activities')->firstOrFail();
        $this->authorize('view', $contact);
        return new ContactResource($contact->load('assignedTo', 'pipelineStage'));
    }

    public function store(Request $request)
    {
        $this->authorize('create', CrmContact::class);
        $data = $request->validate([
            'first_name'  => 'required|string|max:100',
            'last_name'   => 'nullable|string|max:100',
            'email'       => 'required|email|unique:crm_contacts,email',
            'phone'       => 'nullable|string',
            'company'     => 'nullable|string',
            'job_title'   => 'nullable|string',
            'message'     => 'nullable|string',
            'source'      => 'nullable|string',
        ]);
        $data['created_by'] = $request->user()->id;

        // Assign default pipeline stage
        if ($defaultStage = CrmPipelineStage::default()) {
            $data['pipeline_stage_id'] = $defaultStage->id;
        }

        $contact = CrmContact::create($data);
        event(new \App\Events\ContentCreated($contact));
        return new ContactResource($contact);
    }

    public function update(Request $request, string $uuid)
    {
        $contact = CrmContact::where('uuid', $uuid)->firstOrFail();
        $this->authorize('update', $contact);

        $data = $request->validate([
            'status'      => 'nullable|string',
            'priority'    => 'nullable|in:low,normal,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'company'     => 'nullable|string',
            'job_title'   => 'nullable|string',
        ]);

        // Log assignment changes to activity timeline
        if (isset($data['assigned_to']) && $data['assigned_to'] !== $contact->assigned_to) {
            CrmActivity::logSystem($contact, 'assignment',
                "Contact assigned to user #{$data['assigned_to']}",
                ['assigned_to' => $data['assigned_to']]
            );
        }

        $data['updated_by'] = $request->user()->id;
        $contact->update($data);
        return new ContactResource($contact);
    }

    public function destroy(string $uuid)
    {
        $contact = CrmContact::where('uuid', $uuid)->firstOrFail();
        $this->authorize('delete', $contact);
        $contact->delete();
        return response()->json(['message' => 'Contact archived.']);
    }

    /** POST /api/v1/contact — Public website contact form */
    public function publicSubmit(Request $request)
    {
        $data = $request->validate([
            'first_name'  => 'required|string|max:100',
            'last_name'   => 'nullable|string|max:100',
            'email'       => 'required|email',
            'phone'       => 'nullable|string',
            'company'     => 'nullable|string',
            'subject'     => 'nullable|string|max:255',
            'message'     => 'required|string|max:5000',
        ]);

        // 1. Record the raw submission (with technical context)
        $submission = ContactSubmission::create(array_merge($data, [
            'ip_address'   => $request->ip(),
            'user_agent'   => $request->userAgent(),
            'referrer_url' => $request->header('Referer'),
            'utm_params'   => $request->only(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']),
        ]));

        // Reject spam early
        if ($submission->isSpam()) {
            return response()->json(['message' => 'Submission received.'], 200); // Silent rejection
        }

        // 2. Create or update the CRM Contact
        $contact = $this->repository->createOrUpdate([
            'first_name'          => $data['first_name'],
            'last_name'           => $data['last_name'] ?? null,
            'email'               => $data['email'],
            'phone'               => $data['phone'] ?? null,
            'company'             => $data['company'] ?? null,
            'message'             => $data['message'],
            'source'              => 'contact_form',
            'consented_at_submit' => true,
            'pipeline_stage_id'   => CrmPipelineStage::default()?->id,
        ]);

        // 3. Link submission to contact
        $submission->update(['crm_contact_id' => $contact->id, 'status' => 'processed']);

        // 4. Log an activity
        $this->repository->addActivity($contact, [
            'type'         => 'note',
            'subject'      => $data['subject'] ?? 'Contact Form Submission',
            'body'         => $data['message'],
            'performed_at' => now(),
        ]);

        event(new \App\Events\ContentCreated($contact));
        return response()->json(['message' => 'Thank you. We will be in touch soon.'], 201);
    }

    /** GET /crm/contacts/{uuid}/activities */
    public function activities(string $uuid)
    {
        $contact = CrmContact::where('uuid', $uuid)->firstOrFail();
        $this->authorize('view', $contact);
        return response()->json($contact->activities()->with('performedBy')->latest('performed_at')->get());
    }

    /** POST /crm/contacts/{uuid}/activities */
    public function addActivity(Request $request, string $uuid)
    {
        $contact = CrmContact::where('uuid', $uuid)->firstOrFail();
        $this->authorize('update', $contact);
        $data = $request->validate([
            'type'         => 'nullable|in:note,call,email,meeting,task,sms,whatsapp,reminder',
            'subject'      => 'nullable|string|max:255',
            'body'         => 'required|string',
            'performed_at' => 'nullable|date',
            'is_pinned'    => 'nullable|boolean',
            'metadata'     => 'nullable|array',
        ]);
        $data['performed_by'] = $request->user()->id;

        $activity = $this->repository->addActivity($contact, $data);
        $contact->update(['last_contacted_at' => now()]);
        return response()->json($activity, 201);
    }

    /** POST /crm/contacts/{uuid}/stage */
    public function moveStage(Request $request, string $uuid)
    {
        $contact = CrmContact::where('uuid', $uuid)->firstOrFail();
        $this->authorize('update', $contact);
        $data = $request->validate(['stage_uuid' => 'required|string|exists:crm_pipeline_stages,uuid']);
        $this->repository->moveToStage($contact, $data['stage_uuid'], $request->user()->id);
        return response()->json(['message' => 'Stage updated.']);
    }

    /** GET /crm/pipeline */
    public function pipeline()
    {
        $this->authorize('viewAny', CrmContact::class);
        $stages = CrmPipelineStage::orderBy('sort_order')
            ->with(['contacts' => fn($q) => $q->limit(50)])
            ->get();
        return response()->json($stages);
    }
}
