<?php

namespace App\Modules\Seo\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;

/**
 * SEO Health Check (Cross-module)
 *
 * Registered in SeoServiceProvider::boot().
 * Calls SeoHealthChecker::overview() (already implemented) and translates
 * the aggregate into a HealthCheckResult.
 *
 * Thresholds:
 *   CRITICAL — average SEO score < 40
 *   WARNING  — average SEO score < 65 or low_score_count > 20 items
 *   OK       — average score >= 65
 */
class SeoHealthCheck implements HealthCheckInterface
{
    public function __construct(private SeoHealthChecker $checker) {}

    public function name(): string  { return 'seo_health'; }
    public function label(): string { return 'SEO Health'; }
    public function group(): string { return 'seo'; }

    public function run(): HealthCheckResult
    {
        try {
            $overview = $this->checker->overview();

            $avgScore    = $overview['average_score']   ?? 0;
            $lowCount    = $overview['low_score_count'] ?? 0;
            $byType      = $overview['by_type']         ?? [];

            if ($avgScore < 40) {
                return HealthCheckResult::critical(
                    "SEO health critical — average score: {$avgScore}/100, {$lowCount} pages below 50",
                    $overview
                );
            }

            if ($avgScore < 65 || $lowCount > 20) {
                return HealthCheckResult::warning(
                    "SEO health degraded — average score: {$avgScore}/100, {$lowCount} pages below 50",
                    $overview
                );
            }

            return HealthCheckResult::ok(
                "SEO health good — average score: {$avgScore}/100",
                $overview
            );
        } catch (\Throwable $e) {
            return HealthCheckResult::unknown('SEO health check failed: ' . $e->getMessage());
        }
    }
}
