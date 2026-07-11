<?php

namespace App\Modules\Search;

/**
 * SearchQuery — Immutable Query Value Object
 *
 * Replaces the raw ($query, $filters, $limit, $indexVersion) parameter lists
 * that were spreading across the driver, manager, provider, and controller layers.
 *
 * Every driver receives this exact object. No driver ever inspects
 * a loose array of unknowable keys.
 *
 * Usage:
 *
 *   $q = SearchQuery::make()
 *       ->query('laravel')
 *       ->types(['blog', 'portfolio'])
 *       ->locale('en')
 *       ->page(1)
 *       ->perPage(20)
 *       ->sortBy('relevance')
 *       ->facets(['type', 'taxonomy', 'year'])
 *       ->visibility('public')
 *       ->status('published');
 *
 * All setters return a new instance — the object is immutable after construction.
 */
final class SearchQuery
{
    private string  $query        = '';
    private array   $types        = [];        // Empty = all types
    private array   $facetFields  = [];        // Which facet dimensions to return
    private string  $locale       = 'en';
    private ?string $visibility   = 'public';
    private ?string $status       = 'published';
    private ?int    $year         = null;
    private ?string $author       = null;
    private ?string $taxonomy     = null;
    private string  $sortBy       = 'relevance'; // relevance | date | boost
    private int     $page         = 1;
    private int     $perPage      = 20;
    private int     $indexVersion = 1;
    private bool    $adminMode    = false;      // Unlocks visibility override + live providers

    // ── Constructor / Factory ────────────────────────────────────────────────

    private function __construct() {}

    public static function make(): self
    {
        return new self();
    }

    /**
     * Build a SearchQuery from an Illuminate HTTP Request.
     * Convenience factory used in SearchController.
     */
    public static function fromRequest(\Illuminate\Http\Request $request, bool $adminMode = false): self
    {
        $q = self::make()
            ->query(trim($request->query('q', '')))
            ->locale($request->query('locale', 'en'))
            ->page(max(1, (int) $request->query('page', 1)))
            ->perPage(min((int) $request->query('per_page', 20), 100))
            ->adminMode($adminMode)
            ->sortBy($request->query('sort', 'relevance'))
            ->indexVersion(config('search.index_version', 1));

        if ($request->has('type')) {
            $q = $q->types((array) $request->query('type'));
        }

        if ($request->has('facets')) {
            $q = $q->facets((array) $request->query('facets'));
        }

        if ($request->has('year')) {
            $q = $q->year((int) $request->query('year'));
        }

        if ($request->has('author')) {
            $q = $q->author($request->query('author'));
        }

        if ($request->has('taxonomy')) {
            $q = $q->taxonomy($request->query('taxonomy'));
        }

        // Visibility / permission gate
        if ($adminMode) {
            $q = $q->visibility($request->query('visibility'))->status(null);
        } else {
            $q = $q->visibility('public')->status('published');
        }

        return $q;
    }

    // ── Immutable Setters (return new instance) ──────────────────────────────

    public function query(string $value): self
    {
        $clone = clone $this;
        $clone->query = $value;
        return $clone;
    }

    public function types(array $types): self
    {
        $clone = clone $this;
        $clone->types = $types;
        return $clone;
    }

    public function facets(array $fields): self
    {
        $clone = clone $this;
        $clone->facetFields = $fields;
        return $clone;
    }

    public function locale(string $locale): self
    {
        $clone = clone $this;
        $clone->locale = $locale;
        return $clone;
    }

    public function visibility(?string $visibility): self
    {
        $clone = clone $this;
        $clone->visibility = $visibility;
        return $clone;
    }

    public function status(?string $status): self
    {
        $clone = clone $this;
        $clone->status = $status;
        return $clone;
    }

    public function year(?int $year): self
    {
        $clone = clone $this;
        $clone->year = $year;
        return $clone;
    }

    public function author(?string $author): self
    {
        $clone = clone $this;
        $clone->author = $author;
        return $clone;
    }

    public function taxonomy(?string $taxonomy): self
    {
        $clone = clone $this;
        $clone->taxonomy = $taxonomy;
        return $clone;
    }

    public function sortBy(string $sortBy): self
    {
        $clone = clone $this;
        $clone->sortBy = $sortBy;
        return $clone;
    }

    public function page(int $page): self
    {
        $clone = clone $this;
        $clone->page = max(1, $page);
        return $clone;
    }

    public function perPage(int $perPage): self
    {
        $clone = clone $this;
        $clone->perPage = max(1, min($perPage, 100));
        return $clone;
    }

    public function indexVersion(int $version): self
    {
        $clone = clone $this;
        $clone->indexVersion = $version;
        return $clone;
    }

    public function adminMode(bool $adminMode): self
    {
        $clone = clone $this;
        $clone->adminMode = $adminMode;
        return $clone;
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public function getQuery(): string      { return $this->query; }
    public function getTypes(): array       { return $this->types; }
    public function getFacetFields(): array { return $this->facetFields; }
    public function getLocale(): string     { return $this->locale; }
    public function getVisibility(): ?string { return $this->visibility; }
    public function getStatus(): ?string    { return $this->status; }
    public function getYear(): ?int         { return $this->year; }
    public function getAuthor(): ?string    { return $this->author; }
    public function getTaxonomy(): ?string  { return $this->taxonomy; }
    public function getSortBy(): string     { return $this->sortBy; }
    public function getPage(): int          { return $this->page; }
    public function getPerPage(): int       { return $this->perPage; }
    public function getIndexVersion(): int  { return $this->indexVersion; }
    public function isAdminMode(): bool     { return $this->adminMode; }

    /** Offset for SQL LIMIT/OFFSET pagination. */
    public function getOffset(): int
    {
        return ($this->page - 1) * $this->perPage;
    }

    /** Whether the query string is non-empty and meets minimum length. */
    public function isValid(int $minLength = 1): bool
    {
        return mb_strlen(trim($this->query)) >= $minLength;
    }

    /**
     * Collapse query + filters to an array format for legacy driver code
     * or external SDKs that still expect a flat filter bag.
     * Drivers should prefer reading SearchQuery directly.
     */
    public function toFiltersArray(): array
    {
        $filters = [];

        if ($this->visibility !== null) {
            $filters['visibility'] = $this->visibility;
        }

        if ($this->status !== null) {
            $filters['status'] = $this->status;
        }

        if (!empty($this->types)) {
            $filters['type'] = $this->types;
        }

        if ($this->locale !== 'en') {
            $filters['locale'] = $this->locale;
        }

        if ($this->year !== null) {
            $filters['year'] = $this->year;
        }

        if ($this->author !== null) {
            $filters['author'] = $this->author;
        }

        if ($this->taxonomy !== null) {
            $filters['taxonomy'] = $this->taxonomy;
        }

        return $filters;
    }
}
