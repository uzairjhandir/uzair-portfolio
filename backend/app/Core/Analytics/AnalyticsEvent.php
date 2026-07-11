<?php

namespace App\Core\Analytics;

/**
 * Analytics Event DTO
 * 
 * Represents a discrete action to be tracked by the Analytics Engine.
 */
class AnalyticsEvent
{
    public function __construct(
        public readonly string $name,
        public readonly string $category = 'general',
        public readonly array $properties = [],
        public readonly ?float $value = null,
        public readonly ?string $currency = null
    ) {}

    public function toArray(): array
    {
        return [
            'name'       => $this->name,
            'category'   => $this->category,
            'properties' => $this->properties,
            'value'      => $this->value,
            'currency'   => $this->currency,
        ];
    }
}
