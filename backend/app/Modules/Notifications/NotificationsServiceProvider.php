<?php

namespace App\Modules\Notifications;

use App\Modules\Notifications\Drivers\DiscordDriver;
use App\Modules\Notifications\Drivers\MailDriver;
use App\Modules\Notifications\Drivers\NullDriver;
use App\Modules\Notifications\Drivers\PushDriver;
use App\Modules\Notifications\Drivers\SlackDriver;
use App\Modules\Notifications\Drivers\SmsDriver;
use App\Modules\Notifications\Drivers\WebhookDriver;
use App\Modules\Notifications\Drivers\WhatsAppDriver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;

class NotificationsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(NotificationManager::class, function ($app) {
            $manager = new NotificationManager();
            
            // Register channels as Plugins (Recommendation 1)
            $manager->registerChannel(new NullDriver());
            $manager->registerChannel(new MailDriver());
            $manager->registerChannel(new SlackDriver());
            $manager->registerChannel(new WebhookDriver());
            
            // Future drivers
            // $manager->registerChannel(new DiscordDriver());
            // $manager->registerChannel(new SmsDriver());
            // $manager->registerChannel(new WhatsAppDriver());
            // $manager->registerChannel(new PushDriver());

            return $manager;
        });
    }

    public function boot(): void
    {
        // ── Health Check ──────────────────────────────────────────────────────
        // In a real load process, this would be registered to HealthCheckManager
        // $this->app->make(\App\Core\Health\HealthCheckManager::class)
        //     ->register(new \App\Modules\Notifications\Health\NotificationsHealthCheck(
        //         $this->app->make(NotificationManager::class)
        //     ));

        // ── Event Bus Listeners (Recommendation 10) ───────────────────────────
        // Assuming a CRM event exists: \App\Modules\Crm\Events\LeadCreated::class
        // Event::listen(
        //     \App\Modules\Crm\Events\LeadCreated::class,
        //     [\App\Modules\Notifications\Listeners\SystemEventListener::class, 'handleLeadCreated']
        // );
    }
}
