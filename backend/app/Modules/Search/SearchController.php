<?php

namespace App\Modules\Search;

use App\Http\Controllers\Controller;
use App\Modules\Search\Jobs\RebuildSearchIndexJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Search Controller
 *
 * The only layer that knows about HTTP.
 * Constructs a SearchQuery from the request, passes it to SearchManager,
 * and returns SearchResult::toArray() as a JSON response.
 *
 * No raw filter arrays. No hardcoded keys. No loose parameter lists.
 *
 * Public routes:   GET /api/v1/search, /suggest, /related
 * Admin routes:    GET /api/v1/admin/search (Ctrl+K global)
 *                  GET /api/v1/admin/search/health
 *                  POST /api/v1/search/rebuild
 *                  DELETE /api/v1/search/index
 */
class SearchController extends Controller
{
    public function __construct(private SearchManager $search) {}

    // ── Public Search ─────────────────────────────────────────────────────────

    /**
     * GET /api/v1/search
     *
     * Permission-aware public search.
     * Returns: SearchResult shape { query, data, total, took, page, per_page,
     *                               last_page, has_more, facets, suggestions, capabilities }
     *
     * Query params:
     *   q         — search term (required)
     *   type[]    — filter by content type(s)
     *   locale    — filter by locale (default: en)
     *   year      — filter by published year
     *   author    — filter by author metadata
     *   taxonomy  — filter by taxonomy slug
     *   sort      — relevance | date | boost (default: relevance)
     *   page      — page number (default 1)
     *   per_page  — results per page (default 20, max 100)
     */
    public function search(Request $request): JsonResponse
    {
        $query = SearchQuery::fromRequest($request, adminMode: false);

        if (!$query->isValid()) {
            return response()->json(SearchResult::empty($query)->toArray());
        }

        return response()->json(
            $this->search->searchAcrossProviders($query, adminMode: false)->toArray()
        );
    }

    /**
     * GET /api/v1/search/suggest
     *
     * Autocomplete suggestions (fast, minimal data).
     *
     * Query params:
     *   q        — partial search term (min 2 chars for autocomplete)
     *   mode     — autocomplete | recent | popular | trending (default: autocomplete)
     *   locale   — locale for suggestion lookup (default: en)
     *   per_page — max results (default 5, max 20)
     */
    public function suggest(Request $request): JsonResponse
    {
        $mode = $request->query('mode', 'autocomplete');

        $query = SearchQuery::fromRequest($request, adminMode: false)
            ->perPage(min((int) $request->query('per_page', 5), 20));

        // Allow 'recent' / 'popular' / 'trending' without a query string
        if (!$query->isValid(2) && !in_array($mode, ['recent', 'popular', 'trending'])) {
            return response()->json([]);
        }

        return response()->json(
            $this->search->suggest($query, $mode)
        );
    }

    /**
     * GET /api/v1/search/related
     *
     * Find related content for a given resource.
     * Uses ContentRelations graph first (score +50), then similarity fallback.
     *
     * Query params:
     *   type     — content type (e.g. blog, portfolio)
     *   uuid     — UUID of the source resource
     *   per_page — max results (default 5, max 20)
     */
    public function related(Request $request): JsonResponse
    {
        $type = $request->query('type');
        $uuid = $request->query('uuid');
        $limit = min((int) $request->query('per_page', 5), 20);

        if (!$type || !$uuid) {
            return response()->json([]);
        }

        // Resolve the SearchableResource from the index (no model coupling required)
        $row = DB::table('search_index')
            ->where('searchable_uuid', $uuid)
            ->orWhere('uuid', $uuid)
            ->first();

        if (!$row || !class_exists($row->searchable_type)) {
            return response()->json([]);
        }

        $model = app($row->searchable_type)->find($row->searchable_id);

        if (!$model) {
            return response()->json([]);
        }

        return response()->json(
            $this->search->related($model, $limit)
        );
    }

    // ── Admin Global Search (Ctrl+K) ──────────────────────────────────────────

    /**
     * GET /api/v1/admin/search
     *
     * Admin command palette search — no visibility restriction.
     * Searches: Content (indexed) + CRM + Users + Media + Settings (live).
     *
     * Returns a merged SearchResult from all providers.
     *
     * Query params:
     *   q        — search term (required, min 2 chars)
     *   per_page — per-provider limit (default 5 per provider)
     */
    public function adminGlobal(Request $request): JsonResponse
    {
        $this->authorize('search.admin');

        $query = SearchQuery::fromRequest($request, adminMode: true)
            ->perPage(min((int) $request->query('per_page', 5), 20));

        if (!$query->isValid(2)) {
            return response()->json(SearchResult::empty($query)->toArray());
        }

        return response()->json(
            $this->search->searchAcrossProviders($query, adminMode: true)->toArray()
        );
    }

    // ── Index Management ──────────────────────────────────────────────────────

    /**
     * POST /api/v1/search/rebuild
     *
     * Admin only. Dispatches RebuildSearchIndexJob to the queue.
     * Does NOT block — returns immediately.
     *
     * Body params:
     *   type           — (optional) content type to rebuild
     *   target_version — (optional) index_version to write (default: current)
     */
    public function rebuild(Request $request): JsonResponse
    {
        $this->authorize('search.admin');

        $type          = $request->input('type');
        $targetVersion = (int) $request->input('target_version', config('search.index_version', 1));

        RebuildSearchIndexJob::dispatch($type, $targetVersion)->onQueue('search');

        return response()->json([
            'message'        => 'Search index rebuild queued.',
            'type'           => $type ?? 'all',
            'target_version' => $targetVersion,
        ]);
    }

    /**
     * DELETE /api/v1/search/index
     *
     * Admin only. Flushes the index for a specific type or entirely.
     */
    public function flush(Request $request): JsonResponse
    {
        $this->authorize('search.admin');

        $this->search->flush($request->query('type'));

        return response()->json(['message' => 'Search index flushed.']);
    }

    // ── Health ────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/admin/search/health
     *
     * Returns operational search metrics for the Module 19 Dashboard.
     */
    public function health(Request $request): JsonResponse
    {
        $this->authorize('search.admin');

        return response()->json($this->search->health());
    }
}
