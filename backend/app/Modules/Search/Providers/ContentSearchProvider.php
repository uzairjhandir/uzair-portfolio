<?php

namespace App\Modules\Search\Providers;

use App\Modules\Search\Contracts\SearchProviderInterface;
use App\Modules\Search\Contracts\SearchDriverInterface;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;

/**
 * Content Search Provider — Indexed
 *
 * Handles all content module types that live in the search_index table:
 * Blog, Pages, Portfolio, Case Studies, Downloads.
 *
 * Receives a SearchQuery, passes it directly to the active SearchDriver,
 * tags each item with the provider identifier, and returns a SearchResult.
 *
 * module.json "provider": "content" maps to this provider.
 */
class ContentSearchProvider implements SearchProviderInterface
{
    public function __construct(private SearchDriverInterface $driver) {}

    public function identifier(): string  { return 'content'; }
    public function label(): string       { return 'Content'; }
    public function isLive(): bool        { return false; }
    public function requiresAdmin(): bool { return false; }

    public function handledTypes(): array
    {
        return ['blog', 'page', 'portfolio', 'case_study', 'download'];
    }

    public function search(SearchQuery $query): SearchResult
    {
        // Pass the query straight through to the driver
        $result = $this->driver->search($query);

        // Tag each item with this provider's identifier for frontend grouping
        $taggedItems = array_map(function (array $item) {
            $item['provider'] = $this->identifier();
            return $item;
        }, $result->getItems());

        return $result->withItems($taggedItems);
    }
}
