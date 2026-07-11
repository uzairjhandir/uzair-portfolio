<?php

namespace App\Modules\Search\Providers;

use App\Modules\Search\Contracts\SearchProviderInterface;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;
use Illuminate\Support\Facades\DB;

/**
 * User Search Provider — Live
 *
 * Queries the users table in real-time.
 * Users are never indexed — access control changes must be immediate.
 * Admin only. Receives a SearchQuery; returns a SearchResult.
 */
class UserSearchProvider implements SearchProviderInterface
{
    public function identifier(): string  { return 'users'; }
    public function label(): string       { return 'Users'; }
    public function isLive(): bool        { return true; }
    public function requiresAdmin(): bool { return true; }

    public function handledTypes(): array
    {
        return ['user'];
    }

    public function search(SearchQuery $query): SearchResult
    {
        $rawQuery = $query->getQuery();

        $results = DB::table('users')
            ->where(function ($q) use ($rawQuery) {
                $q->where('name',  'like', "%{$rawQuery}%")
                  ->orWhere('email', 'like', "%{$rawQuery}%");
            })
            ->whereNull('deleted_at')
            ->limit($query->getPerPage())
            ->get(['uuid', 'name', 'email', 'created_at']);

        $items = $results->map(fn($row) => [
            'uuid'     => $row->uuid,
            'type'     => 'user',
            'provider' => $this->identifier(),
            'title'    => $row->name,
            'summary'  => $row->email,
            'url'      => "/admin/users/{$row->uuid}",
            'image'    => null,
            'score'    => 1.0,
            'metadata' => [],
        ])->toArray();

        return SearchResult::make()
            ->withQuery($rawQuery)
            ->withPage($query->getPage())
            ->withPerPage($query->getPerPage())
            ->withItems($items)
            ->withTotal(count($items))
            ->withFacets([]);
    }
}
