<?php

namespace App\Modules\Search\Providers;

use App\Modules\Search\Contracts\SearchProviderInterface;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;
use Illuminate\Support\Facades\DB;

/**
 * Settings Search Provider — Live
 *
 * Queries the settings table in real-time.
 * Powers the admin Ctrl+K command palette's Settings section.
 * Admin only. Receives a SearchQuery; returns a SearchResult.
 */
class SettingsSearchProvider implements SearchProviderInterface
{
    public function identifier(): string  { return 'settings'; }
    public function label(): string       { return 'Settings'; }
    public function isLive(): bool        { return true; }
    public function requiresAdmin(): bool { return true; }

    public function handledTypes(): array
    {
        return ['setting'];
    }

    public function search(SearchQuery $query): SearchResult
    {
        $rawQuery = $query->getQuery();

        $results = DB::table('settings')
            ->where(function ($q) use ($rawQuery) {
                $q->where('key',         'like', "%{$rawQuery}%")
                  ->orWhere('label',       'like', "%{$rawQuery}%")
                  ->orWhere('description', 'like', "%{$rawQuery}%");
            })
            ->limit($query->getPerPage())
            ->get(['key', 'label', 'description', 'group', 'type']);

        $items = $results->map(fn($row) => [
            'uuid'     => null,   // Settings use key as identifier
            'type'     => 'setting',
            'provider' => $this->identifier(),
            'title'    => $row->label ?? $row->key,
            'summary'  => $row->description ?? null,
            'url'      => "/admin/settings?key={$row->key}",
            'image'    => null,
            'score'    => 1.0,
            'metadata' => ['group' => $row->group, 'type' => $row->type],
        ])->toArray();

        $groupFacet = DB::table('settings')
            ->where(function ($q) use ($rawQuery) {
                $q->where('key',   'like', "%{$rawQuery}%")
                  ->orWhere('label', 'like', "%{$rawQuery}%");
            })
            ->selectRaw('`group`, COUNT(*) as count')
            ->groupBy('group')
            ->pluck('count', 'group')
            ->toArray();

        return SearchResult::make()
            ->withQuery($rawQuery)
            ->withPage($query->getPage())
            ->withPerPage($query->getPerPage())
            ->withItems($items)
            ->withTotal(count($items))
            ->withFacets(['setting_group' => $groupFacet]);
    }
}
