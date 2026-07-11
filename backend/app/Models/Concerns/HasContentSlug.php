<?php

namespace App\Models\Concerns;

use App\Models\ContentSlugHistory;
use App\Modules\Seo\Jobs\CreateRedirectFromSlugJob;
use Illuminate\Support\Str;

/**
 * Handles slug generation, uniqueness enforcement, and slug history.
 *
 * Slug change pipeline:
 *   Old slug recorded in content_slug_history
 *       ↓
 *   CreateRedirectFromSlugJob dispatched (async, queue: seo)
 *       ↓
 *   301 redirect created: /prefix/old-slug → /prefix/new-slug
 *       ↓
 *   Redirect cache cleared
 *       ↓
 *   SEO-safe URL change with zero manual admin work
 */
trait HasContentSlug
{
    public static function bootHasContentSlug(): void
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = static::generateUniqueSlug($model->title, static::class);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('slug') && $model->getOriginal('slug')) {
                $oldSlug = $model->getOriginal('slug');

                // 1. Record in slug history
                $model->slugHistory()->create([
                    'slug'        => $oldSlug,
                    'is_redirect' => true,
                ]);

                // 2. Dispatch redirect creation (async — never blocks the save)
                $oldPath = $model->getSlugPrefix() . '/' . ltrim($oldSlug, '/');
                $newPath = $model->getSlugPrefix() . '/' . ltrim($model->slug, '/');

                CreateRedirectFromSlugJob::dispatch($oldSlug, $oldPath, $newPath)
                    ->onQueue('seo');
            }
        });
    }

    public static function generateUniqueSlug(string $title, string $class): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i    = 1;

        while (
            static::where('slug', $slug)->exists() ||
            ContentSlugHistory::where('slug', $slug)->exists()
        ) {
            $slug = $base . '-' . $i++;
        }

        return $slug;
    }

    public function slugHistory()
    {
        return $this->morphMany(ContentSlugHistory::class, 'sluggable');
    }

    /**
     * Return the URL prefix for this model's content type.
     * Used by CreateRedirectFromSlugJob to build the source/target path.
     * Override in the model class if using a non-standard prefix.
     */
    public function getSlugPrefix(): string
    {
        return match (class_basename(static::class)) {
            'Blog'      => '/blog',
            'Portfolio' => '/portfolio',
            'CaseStudy' => '/case-studies',
            'Download'  => '/downloads',
            'Page'      => '',
            default     => '/' . strtolower(class_basename(static::class)),
        };
    }

    /**
     * Return the full canonical path for the current slug.
     */
    public function getCanonicalPath(): string
    {
        return $this->getSlugPrefix() . '/' . ltrim($this->slug, '/');
    }
}
