<?php

namespace App\Modules\DeveloperPortal;

use App\Modules\DeveloperPortal\Console\GenerateSdkCommand;
use App\Modules\DeveloperPortal\Console\GenerateSpecCommand;
use Illuminate\Support\ServiceProvider;

class DeveloperPortalServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bindings for the Error, Webhook, and Event Catalogs if needed.
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                GenerateSpecCommand::class,
                GenerateSdkCommand::class,
            ]);
        }

        // Register Scramble (If installed via composer require dedoc/scramble)
        if (class_exists(\Dedoc\Scramble\ScrambleServiceProvider::class)) {
            // \Dedoc\Scramble\Scramble::routes();
        }
    }
}
