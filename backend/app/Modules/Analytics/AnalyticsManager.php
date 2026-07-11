<?php

namespace App\Modules\Analytics;

use App\Core\Analytics\AnalyticsBatch;
use App\Core\Analytics\AnalyticsContext;
use App\Core\Analytics\AnalyticsContextBuilder;
use App\Core\Analytics\AnalyticsEvent;
use App\Core\Analytics\AnalyticsResult;
use App\Modules\Analytics\Contracts\AnalyticsDriverInterface;
use App\Modules\Analytics\Jobs\TrackAnalyticsEventJob;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Foundation\Application;

class AnalyticsManager
{
    /** @var array<string, AnalyticsDriverInterface> */
    private array $drivers = [];
    private AnalyticsContextBuilder $contextBuilder;

    public function __construct(private Application $app)
    {
        $this->contextBuilder = new AnalyticsContextBuilder();
    }

    public function registerDriver(AnalyticsDriverInterface $driver): void
    {
        $this->drivers[$driver->name()] = $driver;
    }

    public function driver(?string $name = null): AnalyticsDriverInterface
    {
        $name = $name ?: config('analytics.default', 'null');

        if (!isset($this->drivers[$name])) {
            throw new \InvalidArgumentException("Analytics driver [{$name}] is not registered.");
        }

        return $this->drivers[$name];
    }

    // ── Tracking Methods (Queue Dispatchers) ──────────────────────────────────

    /**
     * Push an event to the background queue.
     */
    public function track(AnalyticsEvent $event): void
    {
        $context = $this->contextBuilder->build();
        dispatch(new TrackAnalyticsEventJob('track', ['event' => $event], $context));
    }

    public function identify(Authenticatable $user): void
    {
        $context = $this->contextBuilder->build();
        dispatch(new TrackAnalyticsEventJob('identify', ['user' => $user], $context));
    }

    public function pageView(string $url): void
    {
        $context = $this->contextBuilder->build();
        dispatch(new TrackAnalyticsEventJob('pageView', ['url' => $url], $context));
    }

    public function event(string $category, string $action): void
    {
        $context = $this->contextBuilder->build();
        dispatch(new TrackAnalyticsEventJob('event', ['category' => $category, 'action' => $action], $context));
    }

    public function exception(\Throwable $exception): void
    {
        $context = $this->contextBuilder->build();
        dispatch(new TrackAnalyticsEventJob('exception', ['exception' => $exception], $context));
    }

    // ── Dashboard / Widget Helpers ────────────────────────────────────────────

    /**
     * Dashboard Analytics Widget calls this to get high-level metrics.
     */
    public function overview(): array
    {
        $driver = $this->driver();
        // Fallback placeholder if driver doesn't support real-time metrics extraction
        return [
            'driver'  => $driver->name(),
            'enabled' => $driver->isEnabled(),
        ];
    }
}
