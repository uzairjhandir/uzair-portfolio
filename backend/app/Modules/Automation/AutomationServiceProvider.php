<?php

namespace App\Modules\Automation;

use App\Modules\Automation\Actions\AIAction;
use App\Modules\Automation\Actions\ConditionNode;
use App\Modules\Automation\Actions\NotificationAction;
use App\Modules\Automation\Actions\WaitAction;
use App\Modules\Automation\Actions\WebhookAction;
use App\Modules\Automation\Console\AutomationSchedulerCommand;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\ServiceProvider;

class AutomationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ActionRegistry::class, function ($app) {
            $registry = new ActionRegistry();
            
            $registry->register(new WaitAction());
            $registry->register(new WebhookAction());
            $registry->register($app->make(NotificationAction::class));
            $registry->register(new ConditionNode());
            $registry->register(new AIAction());
            
            return $registry;
        });

        $this->app->singleton(WorkflowEngine::class, function ($app) {
            return new WorkflowEngine($app->make(ActionRegistry::class));
        });
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                AutomationSchedulerCommand::class,
            ]);

            // Register the dedicated AutomationSchedulerCommand to run every minute
            $this->app->booted(function () {
                /** @var Schedule $schedule */
                $schedule = $this->app->make(Schedule::class);
                $schedule->command('automation:schedule')->everyMinute()->withoutOverlapping();
            });
        }
    }
}
