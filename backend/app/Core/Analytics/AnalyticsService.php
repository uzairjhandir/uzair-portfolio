<?php

namespace App\Core\Analytics;

/**
 * System-wide analytics service.
 * Distinct from ContentMetricsService (per-content counters).
 * This service aggregates platform-level data: visitors, referrers, devices, conversions.
 *
 * Reserved for Module 20 (Analytics Dashboard) and Module 14 (CRM).
 * Structured now to prevent ad-hoc analytics being scattered across modules.
 *
 * Driver-based design: swap from database to Plausible / Fathom / PostHog
 * by changing the driver binding in AppServiceProvider — zero module changes.
 */
class AnalyticsService
{
    public function __construct(
        private AnalyticsDriverInterface $driver
    ) {}

    /** Record a page/endpoint visit */
    public function recordPageView(string $path, array $context = []): void
    {
        $this->driver->record('pageview', array_merge(['path' => $path], $context));
    }

    /** Record a conversion event (form submit, download, signup) */
    public function recordConversion(string $goal, array $metadata = []): void
    {
        $this->driver->record('conversion', array_merge(['goal' => $goal], $metadata));
    }

    /** Top N content items by views across the platform */
    public function topContent(int $limit = 10): array
    {
        return $this->driver->topContent($limit);
    }

    /** Visitor summary: total, unique, bounce rate */
    public function visitorSummary(string $period = '30d'): array
    {
        return $this->driver->visitorSummary($period);
    }

    /** Traffic sources / referrers */
    public function referrers(string $period = '30d'): array
    {
        return $this->driver->referrers($period);
    }

    /** Device breakdown */
    public function devices(string $period = '30d'): array
    {
        return $this->driver->devices($period);
    }

    /** Geographic breakdown */
    public function countries(string $period = '30d'): array
    {
        return $this->driver->countries($period);
    }
}
