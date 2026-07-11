<?php

namespace App\Modules\Seo\Sitemap\Sources;

use App\Modules\Seo\Contracts\SitemapEntry;
use App\Modules\Seo\Contracts\SitemapSourceInterface;
use Illuminate\Support\Facades\DB;

class BlogSitemapSource implements SitemapSourceInterface
{
    public function section(): string         { return 'blog'; }
    public function label(): string           { return 'Blog Posts'; }
    public function isEnabled(): bool         { return true; }
    public function changeFrequency(): string { return 'weekly'; }
    public function defaultPriority(): float  { return 0.7; }

    public function buildEntries(): iterable
    {
        $baseUrl = rtrim(config('app.url'), '/');

        // Blog index page
        yield SitemapEntry::make(
            loc:        $baseUrl . '/blog',
            lastmod:    now()->toDateString(),
            changefreq: 'daily',
            priority:   0.9,
        );

        // Published blog posts — chunked for memory efficiency
        DB::table('blogs')
            ->where('status', 'published')
            ->whereNull('deleted_at')
            ->orderBy('publish_at', 'desc')
            ->select(['slug', 'updated_at', 'publish_at'])
            ->each(function ($post) use ($baseUrl) {
                yield SitemapEntry::make(
                    loc:        $baseUrl . '/blog/' . $post->slug,
                    lastmod:    date('Y-m-d', strtotime($post->updated_at)),
                    changefreq: $this->changeFrequency(),
                    priority:   $this->defaultPriority(),
                );
            });
    }
}
