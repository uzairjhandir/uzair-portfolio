<?php

namespace App\Modules\Seo\Canonical;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Canonical Service
 *
 * Centralized logic for canonical URL derivation and meta-robots directives.
 *
 * Priority for canonical URL:
 *   1. seo_metadata.canonical_url (manual override)
 *   2. APP_URL + model slug (auto-derived)
 *   3. null (for resources without a public URL)
 *
 * hreflang: architecture reserved — JSON column exists on seo_metadata
 * but is not populated until locale system is built.
 */
class CanonicalService
{
    /**
     * Return the canonical URL for a model.
     * Uses the manual override from seo_metadata if set,
     * otherwise auto-derives from APP_URL + content type prefix + slug.
     */
    public function canonical(Model $model): ?string
    {
        $seo = $this->loadSeo($model);

        if ($seo && !empty($seo->canonical_url)) {
            return $seo->canonical_url;
        }

        return $this->derive($model);
    }

    /**
     * Check whether a model is set to noindex.
     */
    public function isNoindex(Model $model): bool
    {
        $seo = $this->loadSeo($model);
        return $seo && str_contains($seo->robots ?? 'index,follow', 'noindex');
    }

    /**
     * Check whether a model is set to nofollow.
     */
    public function isNofollow(Model $model): bool
    {
        $seo = $this->loadSeo($model);
        return $seo && str_contains($seo->robots ?? 'index,follow', 'nofollow');
    }

    /**
     * Get the robots meta value (e.g. "index,follow" / "noindex,nofollow").
     */
    public function robots(Model $model): string
    {
        $seo = $this->loadSeo($model);
        return $seo?->robots ?? 'index,follow';
    }

    /**
     * hreflang — reserved for future locale implementation.
     * Returns an empty array until the locale system is built.
     */
    public function hreflang(Model $model): array
    {
        $seo = $this->loadSeo($model);
        if (!$seo || empty($seo->hreflang)) {
            return [];
        }

        return json_decode($seo->hreflang, true) ?? [];
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    private function loadSeo(Model $model): ?object
    {
        return DB::table('seo_metadata')
            ->where('seoable_type', get_class($model))
            ->where('seoable_id', $model->id)
            ->first();
    }

    /**
     * Auto-derive canonical URL from content type and slug.
     * Extend this map when new content modules are added.
     */
    private function derive(Model $model): ?string
    {
        if (empty($model->slug)) {
            return null;
        }

        $baseUrl = rtrim(config('app.url'), '/');
        $class   = class_basename($model);

        $prefixMap = [
            'Blog'      => '/blog',
            'Portfolio' => '/portfolio',
            'CaseStudy' => '/case-studies',
            'Download'  => '/downloads',
            'Page'      => '',  // Pages live at root
        ];

        $prefix = $prefixMap[$class] ?? '/' . strtolower($class);

        return $baseUrl . $prefix . '/' . ltrim($model->slug, '/');
    }
}
