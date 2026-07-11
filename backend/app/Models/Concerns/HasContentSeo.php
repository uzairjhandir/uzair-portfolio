<?php

namespace App\Models\Concerns;

use App\Models\SeoMetadata;
use App\Modules\Seo\Canonical\CanonicalService;
use App\Modules\Seo\Schema\SchemaBuilder;

/**
 * Provides polymorphic SEO metadata to any model.
 * Usage: add `use HasContentSeo;` to Blog, Page, Portfolio, etc.
 *
 * Canonical, robots, and schema helpers delegate to the CanonicalService
 * and SchemaBuilder singletons — models themselves contain no SEO logic.
 */
trait HasContentSeo
{
    public function seo()
    {
        return $this->morphOne(SeoMetadata::class, 'seoable');
    }

    public function syncSeo(array $data): SeoMetadata
    {
        return $this->seo()->updateOrCreate(
            ['seoable_type' => static::class, 'seoable_id' => $this->id],
            $data
        );
    }

    public function getSeoTitle(): ?string
    {
        return $this->seo?->title ?? $this->title ?? null;
    }

    public function getSeoDescription(): ?string
    {
        return $this->seo?->description ?? $this->excerpt ?? null;
    }

    // ── Canonical & Robots (delegates to CanonicalService) ────────────────────

    public function getCanonicalUrl(): ?string
    {
        return app(CanonicalService::class)->canonical($this);
    }

    public function isNoindex(): bool
    {
        return app(CanonicalService::class)->isNoindex($this);
    }

    public function isNofollow(): bool
    {
        return app(CanonicalService::class)->isNofollow($this);
    }

    public function getRobots(): string
    {
        return app(CanonicalService::class)->robots($this);
    }

    // ── JSON-LD Schema (delegates to SchemaBuilder) ───────────────────────────

    /**
     * Returns an array of JSON-LD schema arrays for this model.
     * Each element should be injected as a separate <script type="application/ld+json">.
     *
     * @return array[]
     */
    public function getSchemaMarkup(array $context = []): array
    {
        return app(SchemaBuilder::class)->build($this, $context);
    }
}

