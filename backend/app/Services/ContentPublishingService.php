<?php

namespace App\Services;

use App\Enums\ContentStatusEnum;
use Illuminate\Database\Eloquent\Model;

/**
 * Central publishing service. All content types route through here.
 * Enforces the state machine, fires domain events, and triggers post-publish jobs.
 */
class ContentPublishingService
{
    /**
     * Transition a content item to the target status.
     * Enforces valid transitions. Calls lifecycle hooks if present.
     */
    public function transition(Model $content, ContentStatusEnum $target): void
    {
        $current = ContentStatusEnum::from($content->status);

        if (!$current->canTransitionTo($target)) {
            throw new \DomainException(
                "Invalid transition [{$current->label()} → {$target->label()}] for " . $content::class
            );
        }

        // Call model lifecycle hooks if defined
        $this->callHook($content, 'before' . ucfirst($target->value));

        $content->update(['status' => $target->value]);

        $this->callHook($content, 'after' . ucfirst($target->value));

        // Fire domain event
        $eventClass = "App\\Events\\Content" . ucfirst(str_replace('_', '', $target->value));
        if (class_exists($eventClass)) {
            event(new $eventClass($content));
        }
    }

    private function callHook(Model $model, string $method): void
    {
        if (method_exists($model, $method)) {
            $model->$method();
        }
    }
}
