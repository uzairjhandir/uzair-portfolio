<?php

namespace App\Modules\Automation\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;

class AutomationHealthCheck implements HealthCheckInterface
{
    public function name(): string { return 'automation_engine'; }
    public function label(): string { return 'Automation Engine'; }
    public function group(): string { return 'automation'; }

    public function run(): HealthCheckResult
    {
        // 1. Check if queue worker is active (abstract representation)
        // 2. Check if Laravel Scheduler ran recently (e.g. heartbeat cache key from AutomationSchedulerCommand)
        
        $schedulerHeartbeat = cache()->get('automation_scheduler_heartbeat', now()->subMinutes(5));
        
        if ($schedulerHeartbeat < now()->subMinutes(2)) {
            return HealthCheckResult::warning('Automation Scheduler hasn\'t run in the last 2 minutes. Time triggers may be delayed.');
        }

        return HealthCheckResult::ok('Automation Engine and Scheduler are healthy.');
    }
}
