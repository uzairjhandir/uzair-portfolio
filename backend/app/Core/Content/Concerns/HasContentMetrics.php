<?php

namespace App\Core\Content\Concerns;

use App\Core\Metrics\ContentMetricsService;

/**
 * Automatically tracks content metrics when a model is viewed.
 * Blog, Portfolio, Downloads — all get metrics for free.
 *
 * Usage: add `use HasContentMetrics;` alongside other Core traits.
 */
trait HasContentMetrics
{
    public function metrics()
    {
        return $this->morphOne(\App\Core\Metrics\ContentMetric::class, 'measurable');
    }

    public function recordView(): void
    {
        app(ContentMetricsService::class)->incrementViews($this);
    }

    public function recordDownload(): void
    {
        app(ContentMetricsService::class)->incrementDownloads($this);
    }

    public function recordShare(): void
    {
        app(ContentMetricsService::class)->incrementShares($this);
    }

    public function getPopularityScore(): float
    {
        return $this->metrics?->popularity_score ?? 0.0;
    }

    public function isTrending(): bool
    {
        return $this->metrics?->trending_at !== null;
    }
}
