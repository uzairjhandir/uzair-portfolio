<?php

namespace App\Core\Health\Contracts;

/**
 * Health Status Enum
 *
 * Represents the state of a single health check.
 *
 * OK       — nominal, no action needed
 * WARNING  — degraded but functional, investigation recommended
 * CRITICAL — failing, immediate attention required
 * UNKNOWN  — check could not execute (e.g. Redis not configured)
 */
enum HealthStatus: string
{
    case OK       = 'ok';
    case WARNING  = 'warning';
    case CRITICAL = 'critical';
    case UNKNOWN  = 'unknown';

    public function label(): string
    {
        return match ($this) {
            self::OK       => 'Healthy',
            self::WARNING  => 'Degraded',
            self::CRITICAL => 'Critical',
            self::UNKNOWN  => 'Unknown',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::OK       => 'green',
            self::WARNING  => 'yellow',
            self::CRITICAL => 'red',
            self::UNKNOWN  => 'gray',
        };
    }

    /**
     * Numeric weight used for aggregating the overall health score.
     * OK = 100, WARNING = 50, CRITICAL = 0, UNKNOWN = 0.
     */
    public function score(): int
    {
        return match ($this) {
            self::OK      => 100,
            self::WARNING => 50,
            self::CRITICAL, self::UNKNOWN => 0,
        };
    }

    /**
     * Returns the "worst" of two statuses for aggregation.
     * CRITICAL > WARNING > UNKNOWN > OK
     */
    public function worst(self $other): self
    {
        $priority = [
            self::CRITICAL->value => 3,
            self::WARNING->value  => 2,
            self::UNKNOWN->value  => 1,
            self::OK->value       => 0,
        ];

        return $priority[$this->value] >= $priority[$other->value] ? $this : $other;
    }
}
