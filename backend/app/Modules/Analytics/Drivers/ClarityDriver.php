<?php

namespace App\Modules\Analytics\Drivers;

use App\Core\Analytics\AnalyticsBatch;
use App\Core\Analytics\AnalyticsContext;
use App\Core\Analytics\AnalyticsEvent;
use App\Core\Analytics\AnalyticsResult;
use App\Core\Health\HealthCheckResult;
use App\Modules\Analytics\Contracts\AnalyticsDriverInterface;
use Illuminate\Contracts\Auth\Authenticatable;

class ClarityDriver implements AnalyticsDriverInterface
{
    public function name(): string { return 'clarity'; }
    public function isEnabled(): bool { return !empty(config('analytics.clarity.project_id')); }
    
    public function getScriptPayload(): array
    {
        if (!$this->isEnabled()) return [];
        return [
            'driver'     => $this->name(),
            'project_id' => config('analytics.clarity.project_id'),
        ];
    }

    // Clarity is almost exclusively a frontend session recording tool. Server-side tracking is effectively a noop.
    public function track(AnalyticsEvent $event, AnalyticsContext $context): void {}
    public function identify(Authenticatable $user, AnalyticsContext $context): void {}
    public function pageView(string $url, AnalyticsContext $context): void {}
    public function screenView(string $screenName, AnalyticsContext $context): void {}
    public function event(string $category, string $action, AnalyticsContext $context): void {}
    public function timing(string $category, string $variable, int $timeMs, AnalyticsContext $context): void {}
    public function exception(\Throwable $exception, AnalyticsContext $context): void {}
    public function flush(AnalyticsBatch $batch): AnalyticsResult { return AnalyticsResult::SUCCESS; }
    
    public function health(): HealthCheckResult
    {
        return $this->isEnabled() 
            ? HealthCheckResult::ok('Microsoft Clarity is configured.')
            : HealthCheckResult::warning('Clarity Project ID missing.');
    }
}
