<?php

namespace App\Modules\Seo\Sitemap\Sources;

use App\Modules\Seo\Contracts\SitemapEntry;
use App\Modules\Seo\Contracts\SitemapSourceInterface;
use Illuminate\Support\Facades\DB;

class PagesSitemapSource implements SitemapSourceInterface
{
    public function section(): string      { return 'pages'; }
    public function label(): string        { return 'Pages'; }
    public function isEnabled(): bool      { return true; }
    public function changeFrequency(): string { return 'weekly'; }
    public function defaultPriority(): float  { return 0.8; }

    public function buildEntries(): iterable
    {
        $baseUrl = rtrim(config('app.url'), '/');

        // Homepage — always highest priority
        yield SitemapEntry::make(
            loc:         $baseUrl . '/',
            lastmod:     now()->toDateString(),
            changefreq:  'daily',
            priority:    1.0,
        );

        // Published pages with show_in_sitemap = true
        DB::table('pages')
            ->where('status', 'published')
            ->where('show_in_sitemap', true)
            ->whereNull('deleted_at')
            ->orderBy('updated_at', 'desc')
            ->each(function ($page) use ($baseUrl) {
                yield SitemapEntry::make(
                    loc:        $baseUrl . '/' . ltrim($page->slug, '/'),
                    lastmod:    $page->sitemap_last_modified
                                    ? date('Y-m-d', strtotime($page->sitemap_last_modified))
                                    : date('Y-m-d', strtotime($page->updated_at)),
                    changefreq: $page->sitemap_change_frequency ?? $this->changeFrequency(),
                    priority:   (float) ($page->sitemap_priority ?? $this->defaultPriority()),
                );
            });
    }
}
