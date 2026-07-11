<?php

namespace App\Modules\Search\Drivers;

use App\Modules\Search\Contracts\SearchableResource;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;

/**
 * Meilisearch Driver Stub
 *
 * Extends AbstractSearchDriver so all capability flags default to false.
 * Override only what Meilisearch natively supports.
 *
 * When implementing fully:
 *   - Use the official meilisearch/meilisearch-php SDK
 *   - search() maps SearchQuery to Meilisearch search params
 *   - calculateScore() reads the _rankingScore field from Meilisearch results
 *   - Returns SearchResult populated from Meilisearch response JSON
 */
class MeilisearchDriver extends AbstractSearchDriver
{
    // ── Meilisearch Capability Overrides ────────────────────────────────────
    public function supportsHighlighting(): bool { return true; }
    public function supportsFacets(): bool       { return true; }
    public function supportsSuggestions(): bool  { return true; }
    public function supportsSynonyms(): bool     { return true; }

    // ── Stubs (implement when Meilisearch SDK is wired up) ───────────────────

    public function index(SearchableResource $resource): void {}

    public function update(SearchableResource $resource): void {}

    public function remove(SearchableResource $resource): void {}

    public function search(SearchQuery $query): SearchResult
    {
        return SearchResult::empty($query);
    }

    public function suggest(SearchQuery $query, string $mode = 'autocomplete'): array
    {
        return [];
    }

    public function flush(?string $type = null): void {}
}
