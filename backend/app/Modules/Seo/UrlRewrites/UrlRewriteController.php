<?php

namespace App\Modules\Seo\UrlRewrites;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * URL Rewrite Controller — Admin CRUD
 *
 * Admin routes (auth:sanctum):
 *   GET    /api/v1/admin/url-rewrites              — list, filter
 *   POST   /api/v1/admin/url-rewrites              — create
 *   PUT    /api/v1/admin/url-rewrites/{uuid}       — update
 *   DELETE /api/v1/admin/url-rewrites/{uuid}       — delete
 *   POST   /api/v1/admin/url-rewrites/bulk         — bulk activate/deactivate/delete
 *   POST   /api/v1/admin/url-rewrites/{uuid}/test  — test a pattern against a path
 */
class UrlRewriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('seo.admin');

        $rewrites = UrlRewrite::query()
            ->when($request->has('active'), fn($q) => $q->where('is_active', (bool) $request->query('active')))
            ->when($request->has('type'),   fn($q) => $q->where('match_type', $request->query('type')))
            ->when($request->has('q'),      fn($q) => $q->where('source_pattern', 'like', '%' . $request->query('q') . '%'))
            ->orderBy('priority')
            ->paginate(50);

        return response()->json($rewrites);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('seo.admin');

        $validated = $request->validate([
            'source_pattern' => ['required', 'string'],
            'target_path'    => ['required', 'string'],
            'match_type'     => ['required', 'in:exact,wildcard,regex'],
            'is_active'      => ['boolean'],
            'priority'       => ['integer', 'min:1', 'max:999'],
            'note'           => ['nullable', 'string', 'max:255'],
        ]);

        $rewrite = UrlRewrite::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        $this->clearCache();

        return response()->json($rewrite, 201);
    }

    public function update(Request $request, string $uuid): JsonResponse
    {
        $this->authorize('seo.admin');

        $rewrite   = UrlRewrite::where('uuid', $uuid)->firstOrFail();
        $validated = $request->validate([
            'source_pattern' => ['sometimes', 'string'],
            'target_path'    => ['sometimes', 'string'],
            'match_type'     => ['sometimes', 'in:exact,wildcard,regex'],
            'is_active'      => ['boolean'],
            'priority'       => ['integer', 'min:1', 'max:999'],
            'note'           => ['nullable', 'string', 'max:255'],
        ]);

        $rewrite->update($validated);
        $this->clearCache();

        return response()->json($rewrite);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $this->authorize('seo.admin');
        UrlRewrite::where('uuid', $uuid)->firstOrFail()->delete();
        $this->clearCache();
        return response()->json(['message' => 'URL rewrite deleted.']);
    }

    public function bulk(Request $request): JsonResponse
    {
        $this->authorize('seo.admin');

        $validated = $request->validate([
            'action' => ['required', 'in:activate,deactivate,delete'],
            'uuids'  => ['required', 'array', 'min:1'],
            'uuids.*'=> ['uuid'],
        ]);

        $query = UrlRewrite::whereIn('uuid', $validated['uuids']);

        match ($validated['action']) {
            'activate'   => $query->update(['is_active' => true]),
            'deactivate' => $query->update(['is_active' => false]),
            'delete'     => $query->delete(),
        };

        $this->clearCache();

        return response()->json(['message' => "Bulk {$validated['action']} completed."]);
    }

    /**
     * POST /api/v1/admin/url-rewrites/{uuid}/test
     *
     * Test whether a rewrite pattern matches a given path.
     * Lets admins validate regex patterns before activating them.
     */
    public function test(Request $request, string $uuid): JsonResponse
    {
        $this->authorize('seo.admin');

        $rewrite = UrlRewrite::where('uuid', $uuid)->firstOrFail();
        $path    = $request->validate(['path' => ['required', 'string']])['path'];
        $matches = $rewrite->matches($path);

        return response()->json([
            'matches'  => $matches,
            'resolved' => $matches ? $rewrite->resolveTarget($path) : null,
        ]);
    }

    private function clearCache(): void
    {
        Cache::forget('seo:rewrites:active');
    }
}
