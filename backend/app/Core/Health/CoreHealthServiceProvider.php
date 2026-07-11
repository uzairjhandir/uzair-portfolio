<?php

namespace App\Core\Health;

use App\Core\Health\Checks\CacheCheck;
use App\Core\Health\Checks\DatabaseCheck;
use App\Core\Health\Checks\PhpVersionCheck;
use App\Core\Health\Checks\QueueCheck;
use App\Core\Health\Checks\RedisCheck;
use App\Core\Health\Checks\SchedulerCheck;
use App\Core\Health\Checks\StorageDiskCheck;
use Illuminate\Support\ServiceProvider;

/**
 * Core Health Service Provider
 *
 * Registers HealthCheckManager as a singleton and
 * boots all Core system health checks.
 *
 * Module-specific checks (Search, SEO, Media) are registered
 * in their own ServiceProviders — never here.
 *
 * Registration in config/app.php:
 *   App\Core\Health\CoreHealthServiceProvider::class,
 * (must come before all module providers so modules can inject into the manager)
 */
class CoreHealthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(HealthCheckManager::class);
    }

    public function boot(): void
    {
        $manager = $this->app->make(HealthCheckManager::class);

        $manager->register(new PhpVersionCheck());
        $manager->register(new DatabaseCheck());
        $manager->register(new RedisCheck());
        $manager->register(new CacheCheck());
        $manager->register(new QueueCheck());
        $manager->register(new SchedulerCheck());
        $manager->register(new StorageDiskCheck());
    }
}
