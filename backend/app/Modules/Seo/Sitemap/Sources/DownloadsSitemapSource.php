<?php

namespace App\Modules\Seo\Sitemap\Sources;

use App\Modules\Seo\Contracts\SitemapEntry;
use App\Modules\Seo\Contracts\SitemapSourceInterface;
use Illuminate\Support\Facades\DB;

class DownloadsSitemapSource implements SitemapSourceInterface
{
    public function section(): string         { return 'downloads'; }
    public function label(): string           { return 'Downloads'; }
    public function isEnabled(): bool         { return true; }
    public function changeFrequency(): string { return 'monthly'; }
    public function defaultPriority(): float  { return 0.5; }

    public function buildEntries(): iterable
    {
        $baseUrl = rtrim(config('app.url'), '/');

        yield SitemapEntry::make(
            loc:        $baseUrl . '/downloads',
            lastmod:    now()->toDateString(),
            changefreq: 'weekly',
            priority:   0.7,
        );

        DB::table('downloads')
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->whereNull('deleted_at')
            ->orderBy('updated_at', 'desc')
            ->select(['slug', 'updated_at'])
            ->each(function ($item) use ($baseUrl) {
                yield SitemapEntry::make(
                    loc:        $baseUrl . '/downloads/' . $item->slug,
                    lastmod:    date('Y-m-d', strtotime($item->updated_at)),
                    changefreq: $this->changeFrequency(),
                    priority:   $this->defaultPriority(),
                );
            });
    }
}
