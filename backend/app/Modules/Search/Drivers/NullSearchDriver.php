<?php

namespace App\Modules\Search\Drivers;

use App\Modules\Search\Contracts\SearchableResource;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;

/**
 * Null Search Driver
 *
 * Safe no-op driver. Used in:
 *   - Local development when search is disabled
 *   - Testing environments (prevents accidental index mutations)
 *   - Feature-flag disabled search
 *
 * All capability flags remain false (inherited from AbstractSearchDriver).
 * search() returns SearchResult::empty() — never null, never throws.
 */
class NullSearchDriver extends AbstractSearchDriver
{
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
