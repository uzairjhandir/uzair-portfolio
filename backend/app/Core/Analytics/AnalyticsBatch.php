<?php

namespace App\Core\Analytics;

/**
 * Analytics Batch DTO
 * 
 * Groups multiple AnalyticsEvents with their corresponding AnalyticsContexts.
 * Used for flushing events in bulk to APIs that support it (e.g. GA4).
 */
class AnalyticsBatch
{
    /** @var array<int, array{event: AnalyticsEvent, context: AnalyticsContext}> */
    private array $items = [];

    public function add(AnalyticsEvent $event, AnalyticsContext $context): void
    {
        $this->items[] = [
            'event'   => $event,
            'context' => $context,
        ];
    }

    public function items(): array
    {
        return $this->items;
    }

    public function count(): int
    {
        return count($this->items);
    }
}
