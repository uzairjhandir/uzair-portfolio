<?php

namespace App\Core\Notifications;

/**
 * Notification Request DTO
 * 
 * Used by other modules to request a notification dispatch without knowing the underlying driver.
 */
class NotificationRequest
{
    public function __construct(
        public readonly string $templateKey,
        public readonly array $payload = [],
        public readonly ?string $recipientId = null, // e.g., User UUID
        public readonly ?string $recipientContact = null, // e.g., Email or Phone (overrides user lookup)
        public readonly array $channels = [], // e.g. ['mail', 'slack']
        public readonly bool $bypassPreferences = false // e.g. for critical system alerts
    ) {}
}
