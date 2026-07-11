<?php

namespace App\Modules\Seo\Contracts;

/**
 * Sitemap Source Contract
 *
 * Any module that wants its content to appear in the sitemap
 * implements this interface and registers itself with SitemapEngine.
 *
 * SitemapEngine calls buildEntries() to get all URLs for the section,
 * then writes them to storage/app/sitemaps/sitemap-{section}.xml
 *
 * Usage — register in SeoServiceProvider::boot():
 *   $sitemap->registerSource(new BlogSitemapSource());
 */
interface SitemapSourceInterface
{
    /**
     * Machine-readable section identifier.
     * Used as the filename segment: sitemap-{section}.xml
     * Examples: 'blog', 'portfolio', 'pages', 'taxonomy', 'authors'
     */
    public function section(): string;

    /**
     * Human-readable label for admin UI and sitemap_entries table.
     * Examples: "Blog Posts", "Portfolio Projects"
     */
    public function label(): string;

    /**
     * Whether this source is enabled.
     * SitemapEngine skips disabled sources.
     */
    public function isEnabled(): bool;

    /**
     * Default change frequency for all URLs in this section.
     * Individual entries can override this.
     * Valid: always | hourly | daily | weekly | monthly | yearly | never
     */
    public function changeFrequency(): string;

    /**
     * Default priority for all URLs in this section (0.1 – 1.0).
     * Individual entries can override this.
     */
    public function defaultPriority(): float;

    /**
     * Yield SitemapEntry value objects for every URL in this section.
     * Using a generator keeps memory flat for large datasets.
     *
     * @return iterable<SitemapEntry>
     */
    public function buildEntries(): iterable;
}
