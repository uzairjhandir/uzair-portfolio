<?php

namespace App\Core\Notifications;

use DateTime;

/**
 * Delivery Report DTO
 * 
 * Returned by channel drivers to provide structured feedback to the NotificationManager.
 */
class DeliveryReport
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $providerId = null,
        public readonly ?string $message = null,
        public readonly ?DateTime $deliveredAt = null,
        public readonly array $metadata = []
    ) {}

    public static function success(?string $providerId = null, array $metadata = []): self
    {
        return new self(
            success: true,
            providerId: $providerId,
            deliveredAt: new DateTime(),
            metadata: $metadata
        );
    }

    public static function failure(string $message, array $metadata = []): self
    {
        return new self(
            success: false,
            message: $message,
            metadata: $metadata
        );
    }
}
