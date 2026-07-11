<?php

namespace App\Modules\Seo\Sitemap\Sources;

use App\Modules\Seo\Contracts\SitemapEntry;
use App\Modules\Seo\Contracts\SitemapSourceInterface;
use Illuminate\Support\Facades\DB;

/**
 * Taxonomy Sitemap Source
 *
 * Covers all taxonomy types in a single section file:
 *   - Categories   → /category/{slug}
 *   - Tags         → /tag/{slug}
 *   - Technologies → /technology/{slug}  (custom taxonomy type)
 *
 * When new taxonomy types are added, they appear automatically.
 */
class TaxonomySitemapSource implements SitemapSourceInterface
{
    public function section(): string         { return 'taxonomy'; }
    public function label(): string           { return 'Taxonomy (Categories, Tags, Technologies)'; }
    public function isEnabled(): bool         { return true; }
    public function changeFrequency(): string { return 'weekly'; }
    public function defaultPriority(): float  { return 0.5; }

    public function buildEntries(): iterable
    {
        $baseUrl = rtrim(config('app.url'), '/');

        // Map taxonomy type slugs to URL prefixes
        $typePrefixMap = [
            'category'   => 'category',
            'tag'        => 'tag',
            'technology' => 'technology',
        ];

        // Load taxonomy terms with their type's slug
        DB::table('taxonomy_terms as t')
            ->join('taxonomies as tx', 'tx.id', '=', 't.taxonomy_id')
            ->where('t.is_active', true)
            ->whereIn('tx.slug', array_keys($typePrefixMap))
            ->select(['t.slug', 't.updated_at', 'tx.slug as taxonomy_slug'])
            ->orderBy('tx.slug')
            ->orderBy('t.slug')
            ->each(function ($term) use ($baseUrl, $typePrefixMap) {
                $prefix = $typePrefixMap[$term->taxonomy_slug] ?? $term->taxonomy_slug;
                yield SitemapEntry::make(
                    loc:        $baseUrl . '/' . $prefix . '/' . $term->slug,
                    lastmod:    date('Y-m-d', strtotime($term->updated_at)),
                    changefreq: $this->changeFrequency(),
                    priority:   $this->defaultPriority(),
                );
            });
    }
}
