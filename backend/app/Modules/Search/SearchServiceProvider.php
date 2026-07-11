<?php

namespace App\Modules\Search;

use App\Core\Health\HealthCheckManager;
use App\Modules\Search\Health\SearchHealthCheck;
use App\Modules\Search\Providers\ContentSearchProvider;
use App\Modules\Search\Providers\CRMSearchProvider;
use App\Modules\Search\Providers\MediaSearchProvider;
use App\Modules\Search\Providers\SettingsSearchProvider;
use App\Modules\Search\Providers\UserSearchProvider;
use Illuminate\Support\ServiceProvider;

class SearchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SearchManager::class, function ($app) {
            return new SearchManager($app);
        });
    }

    public function boot(): void
    {
        // ── Event Listeners → Queue Pipeline ─────────────────────────────────
        // All indexing is now asynchronous via the Search queue.
        // Direct driver calls are gone — the listener dispatches jobs.

        $events = $this->app['events'];

        $events->listen(\App\Events\ContentPublished::class, [Listeners\SearchIndexListener::class, 'handlePublished']);
        $events->listen(\App\Events\ContentUpdated::class,   [Listeners\SearchIndexListener::class, 'handleUpdated']);
        $events->listen(\App\Events\ContentDeleted::class,   [Listeners\SearchIndexListener::class, 'handleDeleted']);

        // ── Register Search Providers ─────────────────────────────────────────
        // Providers are registered in boot() after the container is ready.
        // Indexed providers need the active driver; live providers need DB.

        /** @var SearchManager $search */
        $search = $this->app->make(SearchManager::class);

        // Indexed provider — routes through the active Driver
        $search->registerProvider(new ContentSearchProvider($search->driver()));

        // Live providers — query source tables directly (admin only)
        $search->registerProvider(new CRMSearchProvider());
        $search->registerProvider(new UserSearchProvider());
        $search->registerProvider(new MediaSearchProvider());
        $search->registerProvider(new SettingsSearchProvider());

        // ── Register Health Check ─────────────────────────────────────────────
        // SearchHealthCheck wraps SearchManager::health() as a HealthCheckResult.
        // Module 19 Dashboard collects this via HealthCheckManager::collect().
        $this->app->make(HealthCheckManager::class)
            ->register(new SearchHealthCheck($search));
    }
}
