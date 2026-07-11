<?php

namespace App\Modules\Analytics;

use App\Modules\Analytics\Drivers\ClarityDriver;
use App\Modules\Analytics\Drivers\GoogleAnalyticsDriver;
use App\Modules\Analytics\Drivers\MatomoDriver;
use App\Modules\Analytics\Drivers\NullDriver;
use App\Modules\Analytics\Drivers\PlausibleDriver;
use App\Modules\Analytics\Drivers\UmamiDriver;
use Illuminate\Support\ServiceProvider;

class AnalyticsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AnalyticsManager::class, function ($app) {
            return new AnalyticsManager($app);
        });
    }

    public function boot(): void
    {
        /** @var AnalyticsManager $manager */
        $manager = $this->app->make(AnalyticsManager::class);

        $manager->registerDriver(new NullDriver());
        $manager->registerDriver(new GoogleAnalyticsDriver());
        $manager->registerDriver(new PlausibleDriver());
        $manager->registerDriver(new UmamiDriver());
        $manager->registerDriver(new MatomoDriver());
        $manager->registerDriver(new ClarityDriver());

        // ── Health Check ──────────────────────────────────────────────────────
        // Health Check registration omitted for brevity.

        // ── Event Listeners ───────────────────────────────────────────────────
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\ContentPublished::class,
            [\App\Modules\Analytics\Listeners\AnalyticsEventListener::class, 'handlePublished']
        );
        // Additional events (DownloadCompleted, SearchExecuted) would be registered here
    }
}
