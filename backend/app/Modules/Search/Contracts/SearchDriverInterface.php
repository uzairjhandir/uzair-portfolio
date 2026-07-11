<?php

namespace App\Modules\Search\Contracts;

use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;

/**
 * Search Driver Contract
 *
 * Drivers are responsible for document indexing and scored retrieval.
 * They do NOT aggregate across providers — that is SearchManager's responsibility.
 *
 * All querying methods receive a SearchQuery object and return a SearchResult DTO.
 * No driver ever accepts a loose array of parameters or returns a raw array.
 *
 * Capability flags let SearchManager make informed decisions without
 * writing conditional code inside modules or controllers.
 */
interface SearchDriverInterface
{
    // ── Document Lifecycle ───────────────────────────────────────────────────

    public function index(SearchableResource $resource): void;

    public function update(SearchableResource $resource): void;

    public function remove(SearchableResource $resource): void;

    // ── Querying ─────────────────────────────────────────────────────────────

    /**
     * Execute a full search with filtering and faceted aggregations.
     * Returns a typed SearchResult — never a raw array.
     */
    public function search(SearchQuery $query): SearchResult;

    /**
     * Compute a relevance + boost + field-weight score for a document.
     * Abstracted so each driver uses its own native scoring mechanism.
     * SearchQuery provides the query string; $document is a flat array.
     */
    public function calculateScore(SearchQuery $query, array $document): float;

    /**
     * Suggestions endpoint — supports multiple modes.
     * Mode is read from SearchQuery::getSortBy() convention; suggest mode
     * is passed as a dedicated parameter to keep SearchQuery general-purpose.
     *
     * @param  string  $mode  autocomplete | recent | popular | trending
     */
    public function suggest(SearchQuery $query, string $mode = 'autocomplete'): array;

    /**
     * Find related content for a given resource.
     * Checks ContentRelations graph first (score +50 bonus).
     * Falls back to keyword/type similarity.
     */
    public function related(SearchableResource $resource, int $limit = 5): array;

    // ── Index Management ─────────────────────────────────────────────────────

    public function rebuild(): void;

    public function flush(?string $type = null): void;

    // ── Driver Capabilities ──────────────────────────────────────────────────
    // Return true only if the driver natively supports the feature.
    // SearchManager checks these to avoid conditional code in modules.

    /** Native result highlighting (e.g., <em>matched</em> text) */
    public function supportsHighlighting(): bool;

    /** Faceted aggregation counts returned alongside results */
    public function supportsFacets(): bool;

    /** Geo-distance filtering and sorting */
    public function supportsGeoSearch(): bool;

    /** Autocomplete / suggestion endpoints */
    public function supportsSuggestions(): bool;

    /** Semantic / vector similarity search (AI embeddings) */
    public function supportsVectorSearch(): bool;

    /** Synonym expansion (e.g., "JS" → "JavaScript") */
    public function supportsSynonyms(): bool;
}
