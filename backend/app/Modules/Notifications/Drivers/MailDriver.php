<?php

namespace App\Modules\Notifications\Drivers;

use App\Core\Health\HealthCheckResult;
use App\Core\Notifications\DeliveryReport;
use App\Modules\Notifications\Contracts\NotificationChannelInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;

class MailDriver implements NotificationChannelInterface
{
    public function name(): string { return 'mail'; }

    public function supports(Model $notificationLog): bool
    {
        // Must have an email address format
        return filter_var($notificationLog->recipient_contact, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function send(Model $notificationLog): DeliveryReport
    {
        // In a real implementation, you would resolve the template body,
        // render the Markdown to HTML, and send it via Laravel Mail::raw or Mailable.
        
        try {
            // Simulated Laravel Mail sending:
            // Mail::to($notificationLog->recipient_contact)->send(new DynamicTemplateMail($notificationLog));
            
            return DeliveryReport::success('smtp_' . uniqid(), [
                'mailer' => config('mail.default'),
            ]);
        } catch (\Throwable $e) {
            // Throwing exception delegates back to the Job's retry policy
            throw $e;
        }
    }

    public function health(): HealthCheckResult
    {
        return !empty(config('mail.mailers.' . config('mail.default') . '.transport'))
            ? HealthCheckResult::ok('Mail transport configured.')
            : HealthCheckResult::warning('Mail transport is missing.');
    }
}
