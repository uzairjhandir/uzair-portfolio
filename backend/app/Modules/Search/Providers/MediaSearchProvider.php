<?php

namespace App\Modules\Search\Providers;

use App\Modules\Search\Contracts\SearchProviderInterface;
use App\Modules\Search\SearchQuery;
use App\Modules\Search\SearchResult;
use Illuminate\Support\Facades\DB;

/**
 * Media Search Provider — Live
 *
 * Queries the media table in real-time.
 * Media metadata changes frequently and must always reflect the current
 * state of the media library.
 *
 * Admin only. Receives a SearchQuery; returns a SearchResult.
 */
class MediaSearchProvider implements SearchProviderInterface
{
    public function identifier(): string  { return 'media'; }
    public function label(): string       { return 'Media'; }
    public function isLive(): bool        { return true; }
    public function requiresAdmin(): bool { return true; }

    public function handledTypes(): array
    {
        return ['media'];
    }

    public function search(SearchQuery $query): SearchResult
    {
        $rawQuery = $query->getQuery();

        $results = DB::table('media')
            ->where(function ($q) use ($rawQuery) {
                $q->where('file_name', 'like', "%{$rawQuery}%")
                  ->orWhere('alt_text',  'like', "%{$rawQuery}%")
                  ->orWhere('caption',   'like', "%{$rawQuery}%")
                  ->orWhere('title',     'like', "%{$rawQuery}%");
            })
            ->whereNull('deleted_at')
            ->limit($query->getPerPage())
            ->get(['uuid', 'file_name', 'title', 'alt_text', 'mime_type', 'url', 'thumbnail_url', 'size']);

        $items = $results->map(fn($row) => [
            'uuid'     => $row->uuid,
            'type'     => 'media',
            'provider' => $this->identifier(),
            'title'    => $row->title ?? $row->file_name,
            'summary'  => $row->alt_text ?? null,
            'url'      => "/admin/media/{$row->uuid}",
            'image'    => $row->thumbnail_url ?? $row->url,
            'score'    => 1.0,
            'metadata' => ['mime_type' => $row->mime_type, 'size' => $row->size],
        ])->toArray();

        $mimeFacet = DB::table('media')
            ->where(function ($q) use ($rawQuery) {
                $q->where('file_name', 'like', "%{$rawQuery}%")
                  ->orWhere('title', 'like', "%{$rawQuery}%");
            })
            ->whereNull('deleted_at')
            ->selectRaw("SUBSTRING_INDEX(mime_type, '/', 1) as media_type, COUNT(*) as count")
            ->groupBy('media_type')
            ->pluck('count', 'media_type')
            ->toArray();

        return SearchResult::make()
            ->withQuery($rawQuery)
            ->withPage($query->getPage())
            ->withPerPage($query->getPerPage())
            ->withItems($items)
            ->withTotal(count($items))
            ->withFacets(['media_type' => $mimeFacet]);
    }
}
