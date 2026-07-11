<?php

namespace App\Modules\Seo\Redirects;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Redirect Controller — Admin CRUD + Export
 *
 * Admin routes (auth:sanctum):
 *   GET    /api/v1/admin/redirects              — list, filter by type/code/active
 *   POST   /api/v1/admin/redirects              — create manual redirect
 *   PUT    /api/v1/admin/redirects/{uuid}       — update
 *   DELETE /api/v1/admin/redirects/{uuid}       — delete
 *   POST   /api/v1/admin/redirects/bulk         — bulk activate/deactivate/delete
 *
 * Public:
 *   GET    /api/v1/redirects/export             — lightweight list for Next.js edge cache
 */
class RedirectController extends Controller
{
    // ── Admin CRUD ────────────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $this->authorize('seo.admin');

        $redirects = Redirect::query()
            ->when($request->has('active'), fn($q) => $q->where('is_active', (bool) $request->query('active')))
            ->when($request->has('type'),   fn($q) => $q->where('match_type', $request->query('type')))
            ->when($request->has('code'),   fn($q) => $q->where('http_code', (int) $request->query('code')))
            ->when($request->has('auto'),   fn($q) => $q->where('is_auto', (bool) $request->query('auto')))
            ->when($request->has('q'),      fn($q) => $q->where('source_path', 'like', '%' . $request->query('q') . '%'))
            ->orderByDesc('hit_count')
            ->paginate(50);

        return response()->json($redirects);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('seo.admin');

        $validated = $request->validate([
            'source_path' => ['required', 'string'],
            'target_path' => ['nullable', 'string'],
            'http_code'   => ['required', 'integer', 'in:301,302,307,308,410'],
            'match_type'  => ['required', 'in:exact,wildcard,regex'],
            'is_active'   => ['boolean'],
            'note'        => ['nullable', 'string', 'max:255'],
        ]);

        $redirect = Redirect::create([
            ...$validated,
            'is_auto'    => false,
            'created_by' => auth()->id(),
        ]);

        $this->clearCache();

        return response()->json($redirect, 201);
    }

    public function update(Request $request, string $uuid): JsonResponse
    {
        $this->authorize('seo.admin');

        $redirect = Redirect::where('uuid', $uuid)->firstOrFail();

        $validated = $request->validate([
            'source_path' => ['sometimes', 'string'],
            'target_path' => ['nullable', 'string'],
            'http_code'   => ['sometimes', 'integer', 'in:301,302,307,308,410'],
            'match_type'  => ['sometimes', 'in:exact,wildcard,regex'],
            'is_active'   => ['boolean'],
            'note'        => ['nullable', 'string', 'max:255'],
        ]);

        $redirect->update($validated);
        $this->clearCache();

        return response()->json($redirect);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $this->authorize('seo.admin');

        Redirect::where('uuid', $uuid)->firstOrFail()->delete();
        $this->clearCache();

        return response()->json(['message' => 'Redirect deleted.']);
    }

    public function bulk(Request $request): JsonResponse
    {
        $this->authorize('seo.admin');

        $validated = $request->validate([
            'action' => ['required', 'in:activate,deactivate,delete'],
            'uuids'  => ['required', 'array', 'min:1'],
            'uuids.*'=> ['uuid'],
        ]);

        $query = Redirect::whereIn('uuid', $validated['uuids']);

        match ($validated['action']) {
            'activate'   => $query->update(['is_active' => true]),
            'deactivate' => $query->update(['is_active' => false]),
            'delete'     => $query->delete(),
        };

        $this->clearCache();

        return response()->json(['message' => "Bulk {$validated['action']} completed."]);
    }

    // ── Export (for Next.js edge middleware cache) ────────────────────────────

    /**
     * GET /api/v1/redirects/export
     *
     * Returns all active redirects as a flat JSON list.
     * Next.js middleware fetches and caches this at build time or on-demand
     * to perform edge-level redirects with zero round-trips to Laravel.
     *
     * Response is cached for 5 minutes server-side.
     * Cache-Control: public, max-age=300 — CDN can cache this too.
     */
    public function export(): JsonResponse
    {
        $data = Cache::remember('seo:redirects:export', now()->addMinutes(5), function () {
            return Redirect::active()
                ->orderBy('match_type') // exact first for client-side priority
                ->get(['source_path', 'target_path', 'http_code', 'match_type'])
                ->toArray();
        });

        return response()
            ->json(['redirects' => $data, 'generated_at' => now()->toIso8601String()])
            ->header('Cache-Control', 'public, max-age=300');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function clearCache(): void
    {
        Cache::forget('seo:redirects:active');
        Cache::forget('seo:redirects:export');
    }
}
