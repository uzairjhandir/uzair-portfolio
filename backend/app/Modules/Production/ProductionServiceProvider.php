<?php

namespace App\Modules\Production;

use App\Modules\Production\Console\DeployCommand;
use App\Modules\Production\Console\ProductionAuditCommand;
use App\Modules\Production\Console\ProductionDoctorCommand;
use App\Modules\Production\Console\ProductionWarmupCommand;
use App\Modules\Production\Http\Middleware\EnhancedMaintenanceMode;
use App\Modules\Production\Http\Middleware\RequestProfilerMiddleware;
use App\Modules\Production\Http\Middleware\SecurityHeaders;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Support\ServiceProvider;

class ProductionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Horizon Configuration Reservation
        // config(['horizon.environments.production' => [ ... ]]);
    }

    public function boot(Kernel $kernel): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                ProductionAuditCommand::class,
                ProductionDoctorCommand::class,
                ProductionWarmupCommand::class,
                DeployCommand::class,
            ]);
        }

        // Register Global Middleware for Production Profiles & Security
        $kernel->pushMiddleware(RequestProfilerMiddleware::class);
        $kernel->pushMiddleware(SecurityHeaders::class);
        
        // Replace native maintenance mode with Enhanced version if necessary
        // $kernel->prependMiddleware(EnhancedMaintenanceMode::class);
    }
}
