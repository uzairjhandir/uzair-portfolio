<?php

namespace App\Modules\Analytics\Contracts;

use App\Core\Analytics\AnalyticsBatch;
use App\Core\Analytics\AnalyticsContext;
use App\Core\Analytics\AnalyticsEvent;
use App\Core\Analytics\AnalyticsResult;
use App\Core\Health\HealthCheckResult;
use Illuminate\Contracts\Auth\Authenticatable;

interface AnalyticsDriverInterface
{
    public function name(): string;

    // ── Configuration ─────────────────────────────────────────────────────────
    
    public function isEnabled(): bool;
    
    /**
     * Returns structured JSON data for the frontend to render the tracking script.
     */
    public function getScriptPayload(): array;

    // ── Tracking ──────────────────────────────────────────────────────────────

    public function track(AnalyticsEvent $event, AnalyticsContext $context): void;
    
    public function identify(Authenticatable $user, AnalyticsContext $context): void;
    
    public function pageView(string $url, AnalyticsContext $context): void;
    
    public function screenView(string $screenName, AnalyticsContext $context): void;
    
    public function event(string $category, string $action, AnalyticsContext $context): void;
    
    public function timing(string $category, string $variable, int $timeMs, AnalyticsContext $context): void;
    
    public function exception(\Throwable $exception, AnalyticsContext $context): void;

    // ── Batching ──────────────────────────────────────────────────────────────
    
    /**
     * Flush a batch of events to the driver's API.
     */
    public function flush(AnalyticsBatch $batch): AnalyticsResult;

    // ── Infrastructure ────────────────────────────────────────────────────────

    public function health(): HealthCheckResult;
}
