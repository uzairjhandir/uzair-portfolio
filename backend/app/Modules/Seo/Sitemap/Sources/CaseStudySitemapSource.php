<?php

namespace App\Modules\Seo\Sitemap\Sources;

use App\Modules\Seo\Contracts\SitemapEntry;
use App\Modules\Seo\Contracts\SitemapSourceInterface;
use Illuminate\Support\Facades\DB;

class CaseStudySitemapSource implements SitemapSourceInterface
{
    public function section(): string         { return 'case-studies'; }
    public function label(): string           { return 'Case Studies'; }
    public function isEnabled(): bool         { return true; }
    public function changeFrequency(): string { return 'monthly'; }
    public function defaultPriority(): float  { return 0.7; }

    public function buildEntries(): iterable
    {
        $baseUrl = rtrim(config('app.url'), '/');

        yield SitemapEntry::make(
            loc:        $baseUrl . '/case-studies',
            lastmod:    now()->toDateString(),
            changefreq: 'weekly',
            priority:   0.8,
        );

        DB::table('case_studies')
            ->where('status', 'published')
            ->whereNull('deleted_at')
            ->orderBy('updated_at', 'desc')
            ->select(['slug', 'updated_at'])
            ->each(function ($item) use ($baseUrl) {
                yield SitemapEntry::make(
                    loc:        $baseUrl . '/case-studies/' . $item->slug,
                    lastmod:    date('Y-m-d', strtotime($item->updated_at)),
                    changefreq: $this->changeFrequency(),
                    priority:   $this->defaultPriority(),
                );
            });
    }
}
