<?php

namespace App\Core\Metrics;

use Illuminate\Database\Eloquent\Model;

/**
 * Central metrics service for all content types.
 * Blog, Portfolio, Downloads, and Case Study all call this — never implement their own counters.
 */
class ContentMetricsService
{
    public function incrementViews(Model $content): void
    {
        $this->metrics($content)->increment('views');
        $this->recalculatePopularity($content);
        event(new \App\Events\ContentViewed($content));
    }

    public function incrementDownloads(Model $content): void
    {
        $this->metrics($content)->increment('downloads');
        $this->recalculatePopularity($content);
    }

    public function incrementShares(Model $content): void
    {
        $this->metrics($content)->increment('shares');
        $this->recalculatePopularity($content);
    }

    public function incrementFavorites(Model $content): void
    {
        $this->metrics($content)->increment('favorites');
        $this->recalculatePopularity($content);
    }

    public function incrementConversions(Model $content): void
    {
        $this->metrics($content)->increment('conversions');
        $this->recalculatePopularity($content);
    }

    // Aliases as requested by user
    public function recordView(Model $content): void { $this->incrementViews($content); }
    public function recordDownload(Model $content): void { $this->incrementDownloads($content); }
    public function recordShare(Model $content): void { $this->incrementShares($content); }
    public function recordFavorite(Model $content): void { $this->incrementFavorites($content); }
    public function recordConversion(Model $content): void { $this->incrementConversions($content); }

    public function getMetrics(Model $content): ContentMetric
    {
        return $this->metrics($content);
    }

    /**
     * Returns top N trending content across all types (or a specific type).
     */
    public function getTrending(string $contentType = null, int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        $query = ContentMetric::orderByDesc('popularity_score')
            ->whereNotNull('trending_at');

        if ($contentType) {
            $query->where('measurable_type', 'like', "%{$contentType}%");
        }

        return $query->limit($limit)->with('measurable')->get();
    }

    /**
     * Weighted popularity score: views(1x) + shares(3x) + downloads(2x) + likes(2x).
     * Marks as trending if score exceeds threshold.
     */
    private function recalculatePopularity(Model $content): void
    {
        $metric = $this->metrics($content);
        $score = ($metric->views * 1) 
               + ($metric->shares * 3) 
               + ($metric->downloads * 2) 
               + ($metric->favorites * 2) 
               + ($metric->conversions * 5);

        $metric->update([
            'popularity_score' => $score,
            'trending_at'      => $score > 500 ? ($metric->trending_at ?? now()) : null,
        ]);
    }

    private function metrics(Model $content): ContentMetric
    {
        return ContentMetric::firstOrCreate([
            'measurable_type' => $content::class,
            'measurable_id'   => $content->id,
        ]);
    }
}
