<?php

namespace App\Modules\Search\Providers;

use App\Modules\Search\Contracts\SearchProviderInterface;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;
use Illuminate\Support\Facades\DB;

/**
 * CRM Search Provider — Live
 *
 * Queries crm_contacts in real-time. CRM data is never indexed into
 * search_index because it is highly dynamic and must always be current.
 *
 * Admin only — public callers never reach this provider.
 * Receives a SearchQuery; returns a SearchResult.
 */
class CRMSearchProvider implements SearchProviderInterface
{
    public function identifier(): string  { return 'crm'; }
    public function label(): string       { return 'CRM Contacts'; }
    public function isLive(): bool        { return true; }
    public function requiresAdmin(): bool { return true; }

    public function handledTypes(): array
    {
        return ['crm_contact'];
    }

    public function search(SearchQuery $query): SearchResult
    {
        $rawQuery = $query->getQuery();

        $results = DB::table('crm_contacts')
            ->where(function ($q) use ($rawQuery) {
                $q->where('name',    'like', "%{$rawQuery}%")
                  ->orWhere('email',   'like', "%{$rawQuery}%")
                  ->orWhere('company', 'like', "%{$rawQuery}%");
            })
            ->whereNull('deleted_at')
            ->limit($query->getPerPage())
            ->get(['uuid', 'name', 'email', 'company', 'status', 'created_at']);

        $items = $results->map(fn($row) => [
            'uuid'     => $row->uuid,
            'type'     => 'crm_contact',
            'provider' => $this->identifier(),
            'title'    => $row->name,
            'summary'  => trim(implode(' · ', array_filter([$row->email, $row->company]))),
            'url'      => "/admin/crm/{$row->uuid}",
            'image'    => null,
            'score'    => 1.0,
            'metadata' => ['status' => $row->status],
        ])->toArray();

        $statusFacet = DB::table('crm_contacts')
            ->where(function ($q) use ($rawQuery) {
                $q->where('name', 'like', "%{$rawQuery}%")
                  ->orWhere('email', 'like', "%{$rawQuery}%");
            })
            ->whereNull('deleted_at')
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return SearchResult::make()
            ->withQuery($rawQuery)
            ->withPage($query->getPage())
            ->withPerPage($query->getPerPage())
            ->withItems($items)
            ->withTotal(count($items))
            ->withFacets(['crm_status' => $statusFacet]);
    }
}
