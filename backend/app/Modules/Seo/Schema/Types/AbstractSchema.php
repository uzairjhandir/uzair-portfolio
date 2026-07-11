<?php

namespace App\Modules\Seo\Schema\Types;

use App\Modules\Seo\Contracts\SchemaTypeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Abstract Schema Base Class
 *
 * Shared helpers for all JSON-LD schema types.
 * Concrete types extend this and implement type() and build().
 *
 * Extensibility:
 *   To add Product, Course, Event, VideoObject, JobPosting — just:
 *   1. Create a class extending AbstractSchema
 *   2. Implement type(), supports(), and build()
 *   3. Register in SeoServiceProvider → SchemaBuilder
 *   4. Done.
 */
abstract class AbstractSchema implements SchemaTypeInterface
{
    // ── Shared Helpers ────────────────────────────────────────────────────────

    /**
     * Build the @context + @type wrapper for any JSON-LD document.
     */
    protected function wrap(string $type, array $properties): array
    {
        return array_merge(
            [
                '@context' => 'https://schema.org',
                '@type'    => $type,
            ],
            $properties
        );
    }

    /**
     * Load the seo_metadata row for a model (lightweight DB query).
     */
    protected function loadSeo(Model $model): ?object
    {
        return DB::table('seo_metadata')
            ->where('seoable_type', get_class($model))
            ->where('seoable_id', $model->id)
            ->first();
    }

    /**
     * Resolve the model's public URL.
     */
    protected function modelUrl(Model $model): string
    {
        $seo = $this->loadSeo($model);

        if ($seo && !empty($seo->canonical_url)) {
            return $seo->canonical_url;
        }

        $base   = rtrim(config('app.url'), '/');
        $class  = class_basename($model);
        $prefix = match ($class) {
            'Blog'      => '/blog',
            'Portfolio' => '/portfolio',
            'CaseStudy' => '/case-studies',
            'Download'  => '/downloads',
            'Page'      => '',
            default     => '/' . strtolower($class),
        };

        return $base . $prefix . '/' . ($model->slug ?? '');
    }

    /**
     * Resolve the OG/Twitter image URL from seo_metadata or the model's featured image.
     */
    protected function imageUrl(Model $model): ?string
    {
        $seo = $this->loadSeo($model);

        if ($seo && $seo->og_image_id) {
            $media = DB::table('media')->where('id', $seo->og_image_id)->value('url');
            if ($media) {
                return $media;
            }
        }

        if (isset($model->featured_image_id)) {
            return DB::table('media')->where('id', $model->featured_image_id)->value('url');
        }

        return null;
    }

    /**
     * Resolve the author name for a given user ID.
     */
    protected function authorName(?int $authorId): ?string
    {
        if (!$authorId) {
            return null;
        }

        return DB::table('users')->where('id', $authorId)->value('name');
    }

    /**
     * Build a minimal Organization sub-schema using settings.
     */
    protected function organizationStub(): array
    {
        return [
            '@type' => 'Organization',
            'name'  => config('app.name'),
            'url'   => config('app.url'),
        ];
    }
}
