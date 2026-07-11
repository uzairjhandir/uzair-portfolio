<?php

namespace App\Modules\Analytics\Drivers;

use App\Core\Analytics\AnalyticsBatch;
use App\Core\Analytics\AnalyticsContext;
use App\Core\Analytics\AnalyticsEvent;
use App\Core\Analytics\AnalyticsResult;
use App\Core\Health\HealthCheckResult;
use App\Modules\Analytics\Contracts\AnalyticsDriverInterface;
use Illuminate\Contracts\Auth\Authenticatable;

class MatomoDriver implements AnalyticsDriverInterface
{
    public function name(): string { return 'matomo'; }
    public function isEnabled(): bool { return !empty(config('analytics.matomo.site_id')); }
    
    public function getScriptPayload(): array
    {
        if (!$this->isEnabled()) return [];
        return [
            'driver'  => $this->name(),
            'site_id' => config('analytics.matomo.site_id'),
            'url'     => config('analytics.matomo.url'),
        ];
    }

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
            ? HealthCheckResult::ok('Matomo is configured.')
            : HealthCheckResult::warning('Matomo configuration missing.');
    }
}
