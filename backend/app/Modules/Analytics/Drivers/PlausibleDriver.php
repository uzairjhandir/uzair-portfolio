<?php

namespace App\Modules\Analytics\Drivers;

use App\Core\Analytics\AnalyticsBatch;
use App\Core\Analytics\AnalyticsContext;
use App\Core\Analytics\AnalyticsEvent;
use App\Core\Analytics\AnalyticsResult;
use App\Core\Health\HealthCheckResult;
use App\Modules\Analytics\Contracts\AnalyticsDriverInterface;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Http;

class PlausibleDriver implements AnalyticsDriverInterface
{
    public function name(): string { return 'plausible'; }
    
    public function isEnabled(): bool
    {
        return !empty(config('analytics.plausible.domain'));
    }
    
    public function getScriptPayload(): array
    {
        if (!$this->isEnabled()) return [];
        
        return [
            'driver' => $this->name(),
            'src'    => config('analytics.plausible.script_url', 'https://plausible.io/js/script.js'),
            'domain' => config('analytics.plausible.domain'),
        ];
    }

    public function track(AnalyticsEvent $event, AnalyticsContext $context): void
    {
        $this->sendEvent($event->name, $event->properties, $context);
    }
    
    public function identify(Authenticatable $user, AnalyticsContext $context): void
    {
        // Plausible doesn't explicitly track user identities by default for privacy,
        // but we can pass it as a custom property if configured.
        $this->sendEvent('Identify', ['user_id' => $user->getAuthIdentifier()], $context);
    }
    
    public function pageView(string $url, AnalyticsContext $context): void
    {
        $this->sendEvent('pageview', ['url' => $url], $context);
    }
    
    public function screenView(string $screenName, AnalyticsContext $context): void
    {
        $this->sendEvent('screenview', ['screen' => $screenName], $context);
    }
    
    public function event(string $category, string $action, AnalyticsContext $context): void
    {
        $this->sendEvent($action, ['category' => $category], $context);
    }
    
    public function timing(string $category, string $variable, int $timeMs, AnalyticsContext $context): void
    {
        $this->sendEvent('timing', ['category' => $category, 'variable' => $variable, 'value' => $timeMs], $context);
    }
    
    public function exception(\Throwable $exception, AnalyticsContext $context): void
    {
        $this->sendEvent('Exception', ['message' => $exception->getMessage()], $context);
    }

    public function flush(AnalyticsBatch $batch): AnalyticsResult
    {
        // Plausible currently doesn't have a bulk event API, so we would loop.
        // For a true batch integration, we'd fire async HTTP requests.
        foreach ($batch->items() as $item) {
            $this->track($item['event'], $item['context']);
        }
        return AnalyticsResult::SUCCESS;
    }

    public function health(): HealthCheckResult
    {
        if (!$this->isEnabled()) {
            return HealthCheckResult::warning('Plausible Analytics domain is not configured.');
        }
        
        return HealthCheckResult::ok('Plausible Analytics is configured.');
    }

    // ── Internal Helpers ──────────────────────────────────────────────────────

    private function sendEvent(string $name, array $props, AnalyticsContext $context): void
    {
        if (!$this->isEnabled()) return;

        $domain = config('analytics.plausible.domain');
        $apiUrl = config('analytics.plausible.api_url', 'https://plausible.io/api/event');

        // Note: Plausible requires the X-Forwarded-For and User-Agent to track accurately.
        $headers = [];
        if ($context->userAgent) $headers['User-Agent'] = $context->userAgent;
        if ($context->ipAddress) $headers['X-Forwarded-For'] = $context->ipAddress;

        $payload = [
            'name'   => $name,
            'domain' => $domain,
            'url'    => $context->url,
        ];

        if (!empty($props)) {
            $payload['props'] = json_encode($props);
        }
        
        if ($context->referrer) {
            $payload['referrer'] = $context->referrer;
        }

        Http::withHeaders($headers)->post($apiUrl, $payload);
    }
}
