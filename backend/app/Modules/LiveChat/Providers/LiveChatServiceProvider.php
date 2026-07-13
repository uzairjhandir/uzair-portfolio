<?php

namespace App\Modules\LiveChat\Providers;

use App\Modules\LiveChat\LiveChatManager;
use Illuminate\Support\ServiceProvider;

class LiveChatServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(LiveChatManager::class, function ($app) {
            return new LiveChatManager($app->make(\App\Modules\Settings\SettingsManager::class));
        });
    }

    public function boot(): void
    {
        //
    }
}
