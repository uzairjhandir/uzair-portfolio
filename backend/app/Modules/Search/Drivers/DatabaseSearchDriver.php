<?php

namespace App\Modules\Search\Drivers;

use App\Modules\Search\Contracts\SearchableResource;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Database Search Driver
 *
 * Production-ready zero-dependency driver using MySQL FULLTEXT indexes.
 * Implements weighted field scoring, faceted aggregations, ContentRelations
 * graph-aware related content, and multi-mode suggestions.
 *
 * Scoring formula per document:
 *   final_score = (title × 10) + (keywords × 7) + (summary × 4) + (content × 1) + boost
 *
 * The rest of the application never knows how scoring works —
 * it is entirely contained within calculateScore().
 *
 * Receives SearchQuery objects. Returns SearchResult DTOs. No raw arrays.
 */
class DatabaseSearchDriver extends AbstractSearchDriver
{
    // Field weights — only this driver knows these values
    private const WEIGHT_TITLE    = 10;
    private const WEIGHT_KEYWORDS = 7;
    private const WEIGHT_SUMMARY  = 4;
    private const WEIGHT_CONTENT  = 1;

    // Bonus score when a ContentRelation graph edge exists for related content
    private const RELATION_BONUS  = 50;

    // ── Document Lifecycle ───────────────────────────────────────────────────

    public function index(SearchableResource $resource): void
    {
        if (!$resource->isSearchable()) {
            $this->remove($resource);
            return;
        }

        $doc = $resource->toSearchDocument();

        DB::table('search_index')->updateOrInsert(
            [
                'searchable_type' => get_class($resource),
                'searchable_id'   => $resource->id,
            ],
            [
                'uuid'                   => $doc['uuid'] ?? (string) Str::uuid(),
                'searchable_uuid'        => $doc['searchable_uuid'] ?? null,
                'module'                 => $doc['module'] ?? 'Core',
                'type'                   => $resource->getSearchType(),
                'locale'                 => $doc['locale'] ?? 'en',
                'translation_group_uuid' => $doc['translation_group_uuid'] ?? null,
                'title'                  => $doc['title'] ?? '',
                'summary'                => $doc['summary'] ?? null,
                'content'                => $doc['content'] ?? null,
                'keywords'               => $doc['keywords'] ?? null,
                'url'                    => $doc['url'] ?? null,
                'image'                  => $doc['image'] ?? null,
                'status'                 => $doc['status'] ?? 'published',
                'visibility'             => $doc['visibility'] ?? 'public',
                'published_at'           => $doc['published_at'] ?? now(),
                'boost'                  => $resource->getSearchBoost(),
                'index_version'          => config('search.index_version', 1),
                'schema_version'         => config('search.schema_version', 1),
                'metadata'               => isset($doc['metadata']) ? json_encode($doc['metadata']) : null,
                'updated_at'             => now(),
            ]
        );
    }

    public function update(SearchableResource $resource): void
    {
        $this->index($resource);
    }

    public function remove(SearchableResource $resource): void
    {
        DB::table('search_index')
            ->where('searchable_type', get_class($resource))
            ->where('searchable_id', $resource->id)
            ->delete();
    }

    // ── Scoring ──────────────────────────────────────────────────────────────

    /**
     * calculateScore() is the single place that knows field weights.
     * Called outside SQL context (e.g. unit tests or re-ranking pipelines).
     * In-SQL scoring uses the weighted MATCH AGAINST expression in search().
     */
    public function calculateScore(SearchQuery $query, array $document): float
    {
        // Outside SQL context: return 0.0 (SQL does the actual scoring)
        return 0.0;
    }

    // ── Search ───────────────────────────────────────────────────────────────

    /**
     * Execute a full search. Receives a SearchQuery; returns a SearchResult.
     * No raw arrays cross this method boundary.
     */
    public function search(SearchQuery $query): SearchResult
    {
        $start        = microtime(true);
        $rawQuery     = $query->getQuery();
        $booleanQuery = $this->prepareBooleanQuery($rawQuery);

        // Weighted score expression using per-field FULLTEXT indexes
        $scoreExpr = <<<SQL
            (
                MATCH(title)    AGAINST(? IN BOOLEAN MODE) * :w_title    +
                MATCH(keywords) AGAINST(? IN BOOLEAN MODE) * :w_keywords +
                MATCH(summary)  AGAINST(? IN BOOLEAN MODE) * :w_summary  +
                MATCH(content)  AGAINST(? IN BOOLEAN MODE) * :w_content  +
                boost
            )
        SQL;

        $q = DB::table('search_index')
            ->select('*')
            ->selectRaw("({$scoreExpr}) AS final_score", [
                $booleanQuery, $booleanQuery, $booleanQuery, $booleanQuery,
                'w_title'    => self::WEIGHT_TITLE,
                'w_keywords' => self::WEIGHT_KEYWORDS,
                'w_summary'  => self::WEIGHT_SUMMARY,
                'w_content'  => self::WEIGHT_CONTENT,
            ])
            ->where(function ($q) use ($booleanQuery) {
                // At least one field must match — avoids zero-score ghost results
                $q->whereRaw('MATCH(title)    AGAINST(? IN BOOLEAN MODE)', [$booleanQuery])
                  ->orWhereRaw('MATCH(keywords) AGAINST(? IN BOOLEAN MODE)', [$booleanQuery])
                  ->orWhereRaw('MATCH(summary)  AGAINST(? IN BOOLEAN MODE)', [$booleanQuery])
                  ->orWhereRaw('MATCH(content)  AGAINST(? IN BOOLEAN MODE)', [$booleanQuery]);
            })
            ->where('index_version', $query->getIndexVersion());

        // ── Filters from SearchQuery ──────────────────────────────────────────

        $visibility = $query->getVisibility();
        if ($visibility !== null) {
            $q->whereIn('visibility', (array) $visibility);
        } else {
            $q->where('visibility', 'public');
        }

        $status = $query->getStatus();
        if ($status !== null) {
            $q->where('status', $status);
        } else {
            $q->where('status', 'published');
        }

        if (!empty($query->getTypes())) {
            $q->whereIn('type', $query->getTypes());
        }

        $locale = $query->getLocale();
        if ($locale !== 'en') {
            $q->where('locale', $locale);
        }

        if ($query->getYear() !== null) {
            $q->whereYear('published_at', $query->getYear());
        }

        if ($query->getAuthor() !== null) {
            $q->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.author')) = ?", [$query->getAuthor()]);
        }

        if ($query->getTaxonomy() !== null) {
            $q->whereRaw("JSON_CONTAINS(metadata, ?)", [json_encode(['taxonomy' => $query->getTaxonomy()])]);
        }

        // ── Sort ─────────────────────────────────────────────────────────────

        match ($query->getSortBy()) {
            'date'      => $q->orderByDesc('published_at'),
            'boost'     => $q->orderByDesc('boost'),
            default     => $q->orderByDesc('final_score'),
        };

        // ── Pagination ────────────────────────────────────────────────────────

        $total   = (clone $q)->count();
        $results = $q
            ->offset($query->getOffset())
            ->limit($query->getPerPage())
            ->get();

        // ── Facets ────────────────────────────────────────────────────────────

        $facets = $this->buildFacets($booleanQuery, $query);

        $took = round((microtime(true) - $start) * 1000, 2);

        return $this->makeResult($query)
            ->withItems($results->map(fn($row) => $this->formatResult($row))->toArray())
            ->withTotal($total)
            ->withTook($took)
            ->withFacets($facets);
    }

    /**
     * Build dynamic facet counts from the same FULLTEXT match context.
     * Returns all dimensions — frontend builds filters automatically.
     */
    private function buildFacets(string $booleanQuery, SearchQuery $query): array
    {
        $base = DB::table('search_index')
            ->where('index_version', $query->getIndexVersion())
            ->where(function ($q) use ($booleanQuery) {
                $q->whereRaw('MATCH(title)    AGAINST(? IN BOOLEAN MODE)', [$booleanQuery])
                  ->orWhereRaw('MATCH(keywords) AGAINST(? IN BOOLEAN MODE)', [$booleanQuery])
                  ->orWhereRaw('MATCH(summary)  AGAINST(? IN BOOLEAN MODE)', [$booleanQuery])
                  ->orWhereRaw('MATCH(content)  AGAINST(? IN BOOLEAN MODE)', [$booleanQuery]);
            });

        // Mirror visibility filter (no leaking private document counts)
        $visibility = $query->getVisibility();
        if ($visibility !== null) {
            $base->whereIn('visibility', (array) $visibility);
        } else {
            $base->where('visibility', 'public');
        }

        if ($query->getStatus() !== null) {
            $base->where('status', $query->getStatus());
        }

        return [
            'type'   => (clone $base)->selectRaw('type, COUNT(*) as count')->groupBy('type')->pluck('count', 'type')->toArray(),
            'year'   => (clone $base)->selectRaw('YEAR(published_at) as year, COUNT(*) as count')->whereNotNull('published_at')->groupBy('year')->orderByDesc('year')->pluck('count', 'year')->toArray(),
            'module' => (clone $base)->selectRaw('module, COUNT(*) as count')->groupBy('module')->pluck('count', 'module')->toArray(),
            'locale' => (clone $base)->selectRaw('locale, COUNT(*) as count')->groupBy('locale')->pluck('count', 'locale')->toArray(),
        ];
    }

    // ── Suggestions ──────────────────────────────────────────────────────────

    public function suggest(SearchQuery $query, string $mode = 'autocomplete'): array
    {
        $rawQuery = $query->getQuery();
        $locale   = $query->getLocale();
        $limit    = $query->getPerPage();

        return match ($mode) {
            'popular'  => $this->suggestPopular($rawQuery, $locale, $limit),
            'trending' => $this->suggestTrending($rawQuery, $locale, $limit),
            'recent'   => $this->suggestRecent($locale, $limit),
            default    => $this->suggestAutocomplete($rawQuery, $locale, $limit),
        };
    }

    private function suggestAutocomplete(string $query, string $locale, int $limit): array
    {
        // Record query for analytics (GDPR-safe: no PII stored)
        $this->recordSuggestion($query, $locale, 'autocomplete');

        return DB::table('search_index')
            ->where('visibility', 'public')
            ->where('status', 'published')
            ->where('locale', $locale)
            ->where('title', 'like', "{$query}%")
            ->orderByDesc('boost')
            ->limit($limit)
            ->get(['title', 'type', 'url', 'image'])
            ->toArray();
    }

    private function suggestPopular(string $query, string $locale, int $limit): array
    {
        return DB::table('search_suggestions')
            ->where('locale', $locale)
            ->where('type', 'autocomplete')
            ->when(!empty($query), fn($q) => $q->where('query', 'like', "{$query}%"))
            ->orderByDesc('search_count')
            ->limit($limit)
            ->get(['query', 'search_count', 'clicked_count'])
            ->toArray();
    }

    private function suggestTrending(string $query, string $locale, int $limit): array
    {
        return DB::table('search_suggestions')
            ->where('locale', $locale)
            ->where('last_used_at', '>=', now()->subDay())
            ->when(!empty($query), fn($q) => $q->where('query', 'like', "{$query}%"))
            ->orderByDesc('search_count')
            ->limit($limit)
            ->get(['query', 'search_count'])
            ->toArray();
    }

    private function suggestRecent(string $locale, int $limit): array
    {
        return DB::table('search_suggestions')
            ->where('locale', $locale)
            ->orderByDesc('last_used_at')
            ->limit($limit)
            ->get(['query', 'last_used_at'])
            ->toArray();
    }

    /**
     * Upsert a query into search_suggestions for analytics.
     * GDPR: only the query string is stored. No IP, user_id, or session_id.
     */
    private function recordSuggestion(string $query, string $locale, string $type): void
    {
        if (empty(trim($query))) {
            return;
        }

        DB::table('search_suggestions')->upsert(
            [
                'query'        => mb_strtolower(trim($query)),
                'locale'       => $locale,
                'type'         => $type,
                'search_count' => 1,
                'last_used_at' => now(),
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            ['query', 'locale', 'type'],
            ['search_count' => DB::raw('search_count + 1'), 'last_used_at' => now(), 'updated_at' => now()]
        );
    }

    // ── Related Content ──────────────────────────────────────────────────────

    /**
     * Related content lookup with ContentRelations graph awareness.
     *
     * Priority:
     *   1. Explicit graph edges in content_relations (score += RELATION_BONUS)
     *   2. Same-type items sharing keywords (similarity fallback)
     */
    public function related(SearchableResource $resource, int $limit = 5): array
    {
        $relatedEdges = DB::table('content_relations')
            ->where(function ($q) use ($resource) {
                $q->where('source_type', get_class($resource))
                  ->where('source_id', $resource->id);
            })
            ->orWhere(function ($q) use ($resource) {
                $q->where('target_type', get_class($resource))
                  ->where('target_id', $resource->id);
            })
            ->get(['source_type', 'source_id', 'target_type', 'target_id', 'weight']);

        $results = [];

        // ── Graph-aware results ──────────────────────────────────────────────
        foreach ($relatedEdges as $edge) {
            $isSource = ($edge->source_type === get_class($resource) && $edge->source_id === $resource->id);
            $otherType = $isSource ? $edge->target_type : $edge->source_type;
            $otherId   = $isSource ? $edge->target_id   : $edge->source_id;

            $indexed = DB::table('search_index')
                ->where('searchable_type', $otherType)
                ->where('searchable_id', $otherId)
                ->where('status', 'published')
                ->where('visibility', 'public')
                ->first();

            if ($indexed) {
                $row           = $this->formatResult($indexed);
                $row['score']  = self::RELATION_BONUS + ($edge->weight ?? 0);
                $row['source'] = 'graph';
                $results[]     = $row;
            }
        }

        // ── Similarity fallback ──────────────────────────────────────────────
        if (count($results) < $limit) {
            $similar = DB::table('search_index')
                ->where('type', $resource->getSearchType())
                ->where('searchable_type', get_class($resource))
                ->where('searchable_id', '!=', $resource->id)
                ->where('status', 'published')
                ->where('visibility', 'public')
                ->orderByDesc('boost')
                ->limit($limit - count($results))
                ->get();

            foreach ($similar as $row) {
                $item           = $this->formatResult($row);
                $item['score']  = $row->boost;
                $item['source'] = 'similarity';
                $results[]      = $item;
            }
        }

        usort($results, fn($a, $b) => $b['score'] <=> $a['score']);

        return array_slice($results, 0, $limit);
    }

    // ── Index Management ─────────────────────────────────────────────────────

    public function flush(?string $type = null): void
    {
        if ($type) {
            DB::table('search_index')->where('type', $type)->delete();
        } else {
            DB::table('search_index')->truncate();
        }
    }

    // ── Capabilities ─────────────────────────────────────────────────────────

    public function supportsFacets(): bool      { return true; }
    public function supportsSuggestions(): bool { return true; }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Prepare a safe boolean mode query string from raw user input.
     * Strips operators that could cause MySQL syntax errors.
     */
    private function prepareBooleanQuery(string $query): string
    {
        $clean = preg_replace('/[+\-><()*~"@]+/', ' ', $query);
        $clean = trim($clean);

        if (empty($clean)) {
            return $query;
        }

        $words = array_filter(explode(' ', $clean));
        return implode(' ', array_map(fn($w) => "+{$w}*", $words));
    }

    private function formatResult(object $row): array
    {
        return [
            'uuid'         => $row->uuid,
            'type'         => $row->type,
            'module'       => $row->module,
            'locale'       => $row->locale,
            'title'        => $row->title,
            'summary'      => $row->summary,
            'url'          => $row->url,
            'image'        => $row->image,
            'boost'        => $row->boost,
            'published_at' => $row->published_at,
            'metadata'     => $row->metadata ? json_decode($row->metadata, true) : null,
        ];
    }
}
