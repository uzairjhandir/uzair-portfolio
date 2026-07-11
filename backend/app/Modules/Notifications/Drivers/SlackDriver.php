<?php

namespace App\Modules\Notifications\Drivers;

use App\Core\Health\HealthCheckResult;
use App\Core\Notifications\DeliveryReport;
use App\Modules\Notifications\Contracts\NotificationChannelInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;

class SlackDriver implements NotificationChannelInterface
{
    public function name(): string { return 'slack'; }

    public function supports(Model $notificationLog): bool
    {
        // Assumes recipient_contact contains either a webhook URL or a Slack user/channel ID
        return !empty($notificationLog->recipient_contact);
    }

    public function send(Model $notificationLog): DeliveryReport
    {
        // Dummy Slack Webhook implementation
        $webhookUrl = config('notifications.slack_webhook_url');
        
        if (!$webhookUrl) {
            throw new \RuntimeException("Slack webhook URL not configured.");
        }

        $response = Http::post($webhookUrl, [
            'text' => "Template: {$notificationLog->template_key}\nPayload: " . json_encode($notificationLog->payload),
        ]);

        if ($response->successful()) {
            return DeliveryReport::success(null, ['status' => $response->status()]);
        }

        throw new \RuntimeException("Slack API failed with status {$response->status()}");
    }

    public function health(): HealthCheckResult
    {
        return !empty(config('notifications.slack_webhook_url'))
            ? HealthCheckResult::ok('Slack webhook URL configured.')
            : HealthCheckResult::warning('Slack webhook URL is missing.');
    }
}
