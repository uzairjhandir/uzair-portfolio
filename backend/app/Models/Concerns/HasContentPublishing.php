<?php

namespace App\Models\Concerns;

use App\Enums\ContentStatusEnum;
use App\Events\ContentPublished;
use App\Events\ContentArchived;
use App\Events\ContentUnpublished;

/**
 * Drives the standard publishing state machine for any content model.
 * Enforces the allowed transitions defined in ContentStatusEnum.
 */
trait HasContentPublishing
{
    public function isPublished(): bool
    {
        return $this->status === ContentStatusEnum::PUBLISHED->value;
    }

    public function isDraft(): bool
    {
        return $this->status === ContentStatusEnum::DRAFT->value;
    }

    public function isArchived(): bool
    {
        return $this->status === ContentStatusEnum::ARCHIVED->value;
    }

    public function transitionTo(ContentStatusEnum $newStatus): void
    {
        $current = ContentStatusEnum::from($this->status);

        if (!$current->canTransitionTo($newStatus)) {
            throw new \InvalidArgumentException(
                "Cannot transition from [{$current->value}] to [{$newStatus->value}]."
            );
        }

        // Lifecycle hook — override in model for custom behavior
        if (method_exists($this, 'beforePublish') && $newStatus === ContentStatusEnum::PUBLISHED) {
            $this->beforePublish();
        }

        $this->update(['status' => $newStatus->value]);

        // Fire domain events
        match($newStatus) {
            ContentStatusEnum::PUBLISHED => event(new ContentPublished($this)),
            ContentStatusEnum::ARCHIVED  => event(new ContentArchived($this)),
            default => null,
        };

        if (method_exists($this, 'afterPublish') && $newStatus === ContentStatusEnum::PUBLISHED) {
            $this->afterPublish();
        }
    }
}
