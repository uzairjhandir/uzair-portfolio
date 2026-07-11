<?php

namespace App\Modules\Notifications\Jobs;

use App\Core\Notifications\Enums\NotificationStatusEnum;
use App\Modules\Notifications\Models\NotificationLog;
use App\Modules\Notifications\NotificationManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DispatchNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $queue = 'notifications';

    // The maximum number of attempts before failing completely. 
    // We set this high, and control actual retries manually.
    public $tries = 10;

    public function __construct(public readonly int $notificationLogId) {}

    public function handle(NotificationManager $manager): void
    {
        $log = NotificationLog::find($this->notificationLogId);

        if (!$log || $log->status === NotificationStatusEnum::CANCELLED->value) {
            return;
        }

        try {
            $driver = $manager->getChannel($log->channel);
            
            // Mark as sending
            $log->update(['status' => NotificationStatusEnum::SENDING->value]);

            $report = $driver->send($log);

            $log->update([
                'status'            => NotificationStatusEnum::DELIVERED->value,
                'sent_at'           => now(),
                'provider_id'       => $report->providerId,
                'provider_metadata' => $report->metadata,
                'error_message'     => null,
            ]);

        } catch (\Throwable $e) {
            $log->increment('attempts');
            $attempts = $log->attempts;

            $retryPolicy = config('notifications.retry_policy', [60, 300, 900, 3600]);

            if ($attempts <= count($retryPolicy)) {
                $delaySeconds = $retryPolicy[$attempts - 1];
                
                $log->update([
                    'status'        => NotificationStatusEnum::RETRIED->value,
                    'error_message' => $e->getMessage(),
                ]);

                // Release the job back onto the queue with the configured delay
                $this->release($delaySeconds);
            } else {
                // Max retries exceeded => DLQ state
                $log->update([
                    'status'        => NotificationStatusEnum::FAILED->value,
                    'error_message' => "Max retries exceeded. Last error: " . $e->getMessage(),
                ]);
                
                $this->fail($e);
            }
        }
    }
}
