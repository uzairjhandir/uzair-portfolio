<?php

namespace App\Modules\Notifications;

use App\Core\Notifications\NotificationRequest;
use App\Core\Notifications\Enums\NotificationStatusEnum;
use App\Modules\Notifications\Contracts\NotificationChannelInterface;
use App\Modules\Notifications\Jobs\DispatchNotificationJob;
use App\Modules\Notifications\Models\NotificationLog;

class NotificationManager
{
    /** @var array<string, NotificationChannelInterface> */
    private array $channels = [];

    /**
     * Register a channel driver (Plugin approach)
     */
    public function registerChannel(NotificationChannelInterface $channel): void
    {
        $this->channels[$channel->name()] = $channel;
    }

    public function getChannel(string $name): NotificationChannelInterface
    {
        if (!isset($this->channels[$name])) {
            throw new \InvalidArgumentException("Notification channel [{$name}] is not registered.");
        }
        return $this->channels[$name];
    }
    
    public function getRegisteredChannels(): array
    {
        return $this->channels;
    }

    /**
     * Dispatch a single notification request.
     * Records it to DB and queues it.
     */
    public function send(NotificationRequest $request): void
    {
        // 1. Resolve Preferences if recipientId is provided and bypass is false
        // (Implementation for Preferences lookup would go here).
        // For now, we proceed with the requested channels.

        $channels = empty($request->channels) ? ['mail'] : $request->channels;

        foreach ($channels as $channelName) {
            // 2. Create Log Entry (State: QUEUED)
            $log = NotificationLog::create([
                'recipient_id'      => $request->recipientId,
                'recipient_contact' => $request->recipientContact ?? 'unknown',
                'channel'           => $channelName,
                'template_key'      => $request->templateKey,
                'payload'           => $request->payload,
                'status'            => NotificationStatusEnum::QUEUED->value,
                'queued_at'         => now(),
            ]);

            // 3. Dispatch to background queue
            dispatch(new DispatchNotificationJob($log->id));
        }
    }

    /**
     * Dispatch the same request to many recipients.
     */
    public function sendMany(array $requests): void
    {
        foreach ($requests as $request) {
            if ($request instanceof NotificationRequest) {
                $this->send($request);
            }
        }
    }
}
