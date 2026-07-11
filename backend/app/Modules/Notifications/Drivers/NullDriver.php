<?php

namespace App\Modules\Notifications\Drivers;

use App\Core\Health\HealthCheckResult;
use App\Core\Notifications\DeliveryReport;
use App\Modules\Notifications\Contracts\NotificationChannelInterface;
use Illuminate\Database\Eloquent\Model;

class NullDriver implements NotificationChannelInterface
{
    public function name(): string { return 'null'; }

    public function supports(Model $notificationLog): bool
    {
        return true;
    }

    public function send(Model $notificationLog): DeliveryReport
    {
        // Simulate a tiny delay for testing
        usleep(10000); 

        return DeliveryReport::success('null_provider_' . uniqid(), [
            'simulated' => true,
        ]);
    }

    public function health(): HealthCheckResult
    {
        return HealthCheckResult::ok('Null driver is active.');
    }
}
