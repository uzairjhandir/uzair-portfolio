<?php

namespace App\Modules\Search;

/**
 * SearchResult — Typed Result DTO
 *
 * Every driver returns this identical object.
 * No driver returns a raw associative array.
 *
 * The controller, provider, and frontend never need to
 * know which driver produced the result — the shape is always the same.
 *
 * Fields:
 *   items        — Paginated result items (see SearchResultItem)
 *   total        — Total matching documents (across all pages)
 *   took         — Query execution time in milliseconds
 *   facets       — Dynamic facet aggregation counts
 *   suggestions  — Related query suggestions (optional)
 *   capabilities — Driver capability snapshot at query time
 *   page         — Current page
 *   perPage      — Results per page
 *   query        — The original query string (for frontend echo)
 *
 * Usage:
 *
 *   return SearchResult::make()
 *       ->withItems($rows)
 *       ->withTotal($count)
 *       ->withTook($ms)
 *       ->withFacets($facets)
 *       ->withQuery($searchQuery->getQuery())
 *       ->withPage($searchQuery->getPage())
 *       ->withPerPage($searchQuery->getPerPage());
 */
final class SearchResult
{
    private array   $items        = [];
    private int     $total        = 0;
    private float   $took         = 0.0;      // ms
    private array   $facets       = [];
    private array   $suggestions  = [];
    private array   $capabilities = [];
    private int     $page         = 1;
    private int     $perPage      = 20;
    private string  $query        = '';

    // ── Factory ───────────────────────────────────────────────────────────────

    private function __construct() {}

    public static function make(): self
    {
        return new self();
    }

    /**
     * Build an empty SearchResult that signals "no results".
     * Drivers return this instead of ['data' => [], 'total' => 0].
     */
    public static function empty(SearchQuery $searchQuery): self
    {
        return self::make()
            ->withQuery($searchQuery->getQuery())
            ->withPage($searchQuery->getPage())
            ->withPerPage($searchQuery->getPerPage());
    }

    // ── Immutable Setters ─────────────────────────────────────────────────────

    public function withItems(array $items): self
    {
        $clone = clone $this;
        $clone->items = $items;
        return $clone;
    }

    public function withTotal(int $total): self
    {
        $clone = clone $this;
        $clone->total = $total;
        return $clone;
    }

    /**
     * @param float $milliseconds  Query execution time
     */
    public function withTook(float $milliseconds): self
    {
        $clone = clone $this;
        $clone->took = round($milliseconds, 2);
        return $clone;
    }

    /**
     * @param array $facets  e.g. ['type' => ['blog' => 15], 'year' => ['2025' => 8]]
     */
    public function withFacets(array $facets): self
    {
        $clone = clone $this;
        $clone->facets = $facets;
        return $clone;
    }

    /**
     * @param array $suggestions  Query suggestions / did-you-mean
     */
    public function withSuggestions(array $suggestions): self
    {
        $clone = clone $this;
        $clone->suggestions = $suggestions;
        return $clone;
    }

    /**
     * Snapshot of driver capabilities at query time.
     * Lets the frontend know which UI features are available.
     */
    public function withCapabilities(array $capabilities): self
    {
        $clone = clone $this;
        $clone->capabilities = $capabilities;
        return $clone;
    }

    public function withPage(int $page): self
    {
        $clone = clone $this;
        $clone->page = $page;
        return $clone;
    }

    public function withPerPage(int $perPage): self
    {
        $clone = clone $this;
        $clone->perPage = $perPage;
        return $clone;
    }

    public function withQuery(string $query): self
    {
        $clone = clone $this;
        $clone->query = $query;
        return $clone;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public function getItems(): array        { return $this->items; }
    public function getTotal(): int          { return $this->total; }
    public function getTook(): float         { return $this->took; }
    public function getFacets(): array       { return $this->facets; }
    public function getSuggestions(): array  { return $this->suggestions; }
    public function getCapabilities(): array { return $this->capabilities; }
    public function getPage(): int           { return $this->page; }
    public function getPerPage(): int        { return $this->perPage; }
    public function getQuery(): string       { return $this->query; }

    /** Last page number. Returns 1 when total is 0 to avoid division by zero. */
    public function getLastPage(): int
    {
        if ($this->perPage <= 0 || $this->total <= 0) {
            return 1;
        }

        return (int) ceil($this->total / $this->perPage);
    }

    /** Whether there is a next page. */
    public function hasMorePages(): bool
    {
        return $this->page < $this->getLastPage();
    }

    // ── Serialisation ─────────────────────────────────────────────────────────

    /**
     * Serialize to an array for JSON responses.
     *
     * Shape:
     * {
     *   "query":        "laravel",
     *   "data":         [...],
     *   "total":        26,
     *   "took":         4.7,
     *   "page":         1,
     *   "per_page":     20,
     *   "last_page":    2,
     *   "has_more":     true,
     *   "facets":       { "type": { "blog": 15 } },
     *   "suggestions":  [],
     *   "capabilities": { "highlighting": false, ... }
     * }
     */
    public function toArray(): array
    {
        return [
            'query'        => $this->query,
            'data'         => $this->items,
            'total'        => $this->total,
            'took'         => $this->took,
            'page'         => $this->page,
            'per_page'     => $this->perPage,
            'last_page'    => $this->getLastPage(),
            'has_more'     => $this->hasMorePages(),
            'facets'       => $this->facets,
            'suggestions'  => $this->suggestions,
            'capabilities' => $this->capabilities,
        ];
    }

    /**
     * Merge two SearchResult objects.
     * Used by SearchManager when aggregating across multiple providers.
     * Items are appended, totals summed, facets deep-merged.
     */
    public function merge(SearchResult $other): self
    {
        $mergedFacets = $this->facets;

        foreach ($other->facets as $dimension => $counts) {
            foreach ($counts as $bucket => $count) {
                $mergedFacets[$dimension][$bucket] = ($mergedFacets[$dimension][$bucket] ?? 0) + $count;
            }
        }

        return self::make()
            ->withQuery($this->query)
            ->withPage($this->page)
            ->withPerPage($this->perPage)
            ->withItems(array_merge($this->items, $other->items))
            ->withTotal($this->total + $other->total)
            ->withTook(max($this->took, $other->took))   // Report the slowest provider
            ->withFacets($mergedFacets)
            ->withSuggestions(array_merge($this->suggestions, $other->suggestions))
            ->withCapabilities($this->capabilities ?: $other->capabilities);
    }
}
