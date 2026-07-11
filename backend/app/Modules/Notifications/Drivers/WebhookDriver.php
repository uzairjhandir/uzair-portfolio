<?php

namespace App\Modules\Notifications\Drivers;

use App\Core\Health\HealthCheckResult;
use App\Core\Notifications\DeliveryReport;
use App\Modules\Notifications\Contracts\NotificationChannelInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;

class WebhookDriver implements NotificationChannelInterface
{
    public function name(): string { return 'webhook'; }

    public function supports(Model $notificationLog): bool
    {
        return str_starts_with($notificationLog->recipient_contact, 'http');
    }

    public function send(Model $notificationLog): DeliveryReport
    {
        $url = $notificationLog->recipient_contact;
        $payload = $notificationLog->payload ?? [];
        
        $secret = config('notifications.webhook_secret');
        $signature = $secret ? hash_hmac('sha256', json_encode($payload), $secret) : null;

        $response = Http::timeout(config('notifications.webhook_timeout', 10))
            ->withHeaders(array_filter([
                'X-Signature' => $signature,
                'Content-Type'=> 'application/json',
            ]))
            ->post($url, $payload);

        if ($response->successful()) {
            return DeliveryReport::success(null, ['status' => $response->status()]);
        }

        // Trigger retry via exception
        throw new \RuntimeException("Webhook failed with status {$response->status()}: {$response->body()}");
    }

    public function health(): HealthCheckResult
    {
        return HealthCheckResult::ok('Webhook driver ready.');
    }
}
