<?php

namespace App\Core\Analytics;

interface AnalyticsDriverInterface
{
    public function record(string $event, array $data): void;
    public function topContent(int $limit): array;
    public function visitorSummary(string $period): array;
    public function referrers(string $period): array;
    public function devices(string $period): array;
    public function countries(string $period): array;
}

/**
 * Default no-op driver.
 * Replace with PlausibleDriver or PostHogDriver in AppServiceProvider
 * when Module 20 (Analytics Dashboard) is implemented.
 */
class NullAnalyticsDriver implements AnalyticsDriverInterface
{
    public function record(string $event, array $data): void {}
    public function topContent(int $limit): array { return []; }
    public function visitorSummary(string $period): array { return []; }
    public function referrers(string $period): array { return []; }
    public function devices(string $period): array { return []; }
    public function countries(string $period): array { return []; }
}
