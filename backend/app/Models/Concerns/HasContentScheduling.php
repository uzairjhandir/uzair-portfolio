<?php

namespace App\Models\Concerns;

/**
 * Enables scheduled publishing and automatic expiration.
 */
trait HasContentScheduling
{
    public function isScheduled(): bool
    {
        return $this->publish_at && $this->publish_at->isFuture();
    }

    public function isExpired(): bool
    {
        return $this->expire_at && $this->expire_at->isPast();
    }

    public function scheduleFor(\DateTimeInterface $publishAt, ?\DateTimeInterface $expireAt = null): void
    {
        $this->update([
            'status' => \App\Enums\ContentStatusEnum::SCHEDULED->value,
            'publish_at' => $publishAt,
            'expire_at' => $expireAt,
        ]);

        event(new \App\Events\ContentScheduled($this));
    }
}
