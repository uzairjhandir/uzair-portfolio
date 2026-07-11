<?php

namespace App\Modules\Notifications\Contracts;

use App\Core\Health\HealthCheckResult;
use App\Core\Notifications\DeliveryReport;
use Illuminate\Database\Eloquent\Model;

interface NotificationChannelInterface
{
    /**
     * Machine name of the channel (e.g. 'mail', 'slack')
     */
    public function name(): string;

    /**
     * Determine if this channel supports the given notification log payload.
     */
    public function supports(Model $notificationLog): bool;

    /**
     * Attempt to send the notification.
     * Throws an exception on critical failure (which triggers the retry queue).
     */
    public function send(Model $notificationLog): DeliveryReport;

    /**
     * Health check to ensure the channel's credentials/connections are valid.
     */
    public function health(): HealthCheckResult;
}
