<?php

namespace App\Modules\Notifications\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use App\Modules\Notifications\NotificationManager;

class NotificationsHealthCheck implements HealthCheckInterface
{
    public function __construct(private NotificationManager $manager) {}

    public function name(): string { return 'notifications_channels'; }
    
    public function label(): string { return 'Notification Channels'; }
    
    public function group(): string { return 'notifications'; }

    public function run(): HealthCheckResult
    {
        $channels = $this->manager->getRegisteredChannels();
        $statuses = [];
        $hasError = false;
        $hasWarning = false;

        foreach ($channels as $name => $driver) {
            try {
                $result = $driver->health();
                $statuses[$name] = $result->status->value;

                if ($result->status->value === 'critical') $hasError = true;
                if ($result->status->value === 'warning') $hasWarning = true;
                
            } catch (\Throwable $e) {
                $statuses[$name] = 'critical';
                $hasError = true;
            }
        }

        if ($hasError) {
            return HealthCheckResult::critical('One or more notification channels are failing.', ['channels' => $statuses]);
        }

        if ($hasWarning) {
            return HealthCheckResult::warning('One or more notification channels have warnings.', ['channels' => $statuses]);
        }

        return HealthCheckResult::ok('All registered notification channels are healthy.', ['channels' => $statuses]);
    }
}
