<?php

namespace App\Modules\Search\Contracts;

use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;

/**
 * Search Provider Contract
 *
 * Providers abstract a data source into a searchable unit.
 * There are two provider categories:
 *
 *   Indexed Providers  — query the search_index table via a SearchDriver
 *   Live Providers     — query the source database table directly (real-time)
 *
 * SearchManager aggregates SearchResult objects from all registered providers
 * via SearchResult::merge() and returns a single unified response.
 */
interface SearchProviderInterface
{
    /**
     * Unique machine-readable identifier for this provider.
     * Used in module.json "provider" field and facet keys.
     *
     * Examples: "content", "crm", "users", "media", "settings"
     */
    public function identifier(): string;

    /**
     * Human-readable label shown in admin UI.
     */
    public function label(): string;

    /**
     * Whether this provider searches the index (false) or queries live data (true).
     */
    public function isLive(): bool;

    /**
     * Whether admin authentication is required to use this provider.
     * Live providers (CRM, Users, Settings) are always admin-only.
     */
    public function requiresAdmin(): bool;

    /**
     * The content types this provider handles.
     * Used for facet grouping and type filtering.
     *
     * @return string[]  e.g. ['blog', 'portfolio', 'page']
     */
    public function handledTypes(): array;

    /**
     * Execute a search against this provider.
     * Receives the full SearchQuery object and returns a SearchResult DTO.
     * No raw arrays cross the provider boundary.
     */
    public function search(SearchQuery $query): SearchResult;
}
