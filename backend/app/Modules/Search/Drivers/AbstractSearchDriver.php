<?php

namespace App\Modules\Search\Drivers;

use App\Modules\Search\Contracts\SearchDriverInterface;
use App\Modules\Search\Contracts\SearchableResource;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;

/**
 * Abstract base for all Search Drivers.
 *
 * Provides safe default capability flags (all false) and default
 * implementations for methods that not all drivers need to implement.
 * Concrete drivers override only the capabilities and methods they support.
 *
 * This eliminates conditional code in modules and controllers:
 *
 *   ✅  if ($search->supportsFacets()) { ... }
 *   ❌  if (config('search.default') === 'meilisearch') { ... }
 */
abstract class AbstractSearchDriver implements SearchDriverInterface
{
    // ── Default Capability Flags ─────────────────────────────────────────────
    // Database driver: highlighting ❌, geo ❌, vector ❌, synonyms ❌
    // Meilisearch:     highlighting ✅, facets ✅, synonyms ✅
    // Elasticsearch:   all ✅

    public function supportsHighlighting(): bool   { return false; }
    public function supportsFacets(): bool         { return false; }
    public function supportsGeoSearch(): bool      { return false; }
    public function supportsSuggestions(): bool    { return true;  } // All drivers suggest via search_suggestions
    public function supportsVectorSearch(): bool   { return false; }
    public function supportsSynonyms(): bool       { return false; }

    /**
     * Default calculateScore() — returns 0.0.
     * Concrete drivers should override this with their native scoring.
     */
    public function calculateScore(SearchQuery $query, array $document): float
    {
        return 0.0;
    }

    /**
     * Default related() — returns empty array.
     * Concrete drivers that support semantic similarity should override.
     */
    public function related(SearchableResource $resource, int $limit = 5): array
    {
        return [];
    }

    /**
     * Default suggest() — returns empty array.
     * Concrete drivers should override with their suggestion implementation.
     */
    public function suggest(SearchQuery $query, string $mode = 'autocomplete'): array
    {
        return [];
    }

    /**
     * Default rebuild() — no-op.
     * Drivers that maintain an external index should override.
     */
    public function rebuild(): void {}

    /**
     * Helper: build a SearchResult stub pre-populated with query metadata.
     * Call this in search() implementations as the starting point.
     */
    protected function makeResult(SearchQuery $query): SearchResult
    {
        return SearchResult::make()
            ->withQuery($query->getQuery())
            ->withPage($query->getPage())
            ->withPerPage($query->getPerPage());
    }
}
