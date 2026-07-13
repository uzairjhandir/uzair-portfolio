<?php

namespace App\Modules\Settings\Providers;

use App\Modules\Settings\SettingsManager;
use Illuminate\Support\ServiceProvider;

class SettingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SettingsManager::class, function ($app) {
            return new SettingsManager($app->make(\App\Services\SettingService::class));
        });
    }

    public function boot(): void
    {
        //
    }
}
