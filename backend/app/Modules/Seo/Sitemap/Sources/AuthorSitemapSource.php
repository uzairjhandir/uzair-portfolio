<?php

namespace App\Modules\Seo\Sitemap\Sources;

use App\Modules\Seo\Contracts\SitemapEntry;
use App\Modules\Seo\Contracts\SitemapSourceInterface;
use Illuminate\Support\Facades\DB;

/**
 * Author Sitemap Source
 *
 * Generates sitemap entries for author archive pages.
 * Only includes users who have published at least one public blog post.
 *
 * URL pattern: /author/{username}
 *
 * Set isEnabled() to false if you do not have author archive pages on the frontend.
 */
class AuthorSitemapSource implements SitemapSourceInterface
{
    public function section(): string         { return 'authors'; }
    public function label(): string           { return 'Authors'; }
    public function isEnabled(): bool         { return (bool) config('seo.sitemap.authors_enabled', false); }
    public function changeFrequency(): string { return 'monthly'; }
    public function defaultPriority(): float  { return 0.4; }

    public function buildEntries(): iterable
    {
        $baseUrl = rtrim(config('app.url'), '/');

        // Authors with at least one published blog post
        DB::table('users as u')
            ->join('blogs as b', 'b.author_id', '=', 'u.id')
            ->where('b.status', 'published')
            ->whereNull('b.deleted_at')
            ->groupBy('u.id', 'u.name', 'u.updated_at')
            ->select([
                'u.id',
                DB::raw('LOWER(REPLACE(u.name, " ", "-")) as slug'),
                DB::raw('MAX(b.updated_at) as last_post_at'),
            ])
            ->each(function ($author) use ($baseUrl) {
                yield SitemapEntry::make(
                    loc:        $baseUrl . '/author/' . $author->slug,
                    lastmod:    date('Y-m-d', strtotime($author->last_post_at)),
                    changefreq: $this->changeFrequency(),
                    priority:   $this->defaultPriority(),
                );
            });
    }
}
