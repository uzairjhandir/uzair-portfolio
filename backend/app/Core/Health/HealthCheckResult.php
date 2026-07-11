<?php

namespace App\Core\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\Contracts\HealthStatus;

/**
 * Health Check Result — Value Object
 *
 * Represents the outcome of a single health check.
 * Immutable. Factory methods for each status level.
 *
 * Usage:
 *   return HealthCheckResult::ok('Database responding in 2.1ms', ['latency_ms' => 2.1]);
 *   return HealthCheckResult::warning('Queue backlog: 1,240 jobs', ['backlog' => 1240]);
 *   return HealthCheckResult::critical('Redis unreachable', ['error' => 'Connection refused']);
 *   return HealthCheckResult::unknown('Redis not configured');
 */
final class HealthCheckResult
{
    public function __construct(
        public readonly HealthStatus $status,
        public readonly string       $message,
        public readonly array        $metadata    = [],
        public readonly float        $durationMs  = 0.0,
        public readonly ?string      $name        = null,
        public readonly ?string      $label       = null,
        public readonly ?string      $group       = null,
    ) {}

    // ── Factory Methods ───────────────────────────────────────────────────────

    public static function ok(string $message, array $metadata = [], float $durationMs = 0.0): self
    {
        return new self(HealthStatus::OK, $message, $metadata, $durationMs);
    }

    public static function warning(string $message, array $metadata = [], float $durationMs = 0.0): self
    {
        return new self(HealthStatus::WARNING, $message, $metadata, $durationMs);
    }

    public static function critical(string $message, array $metadata = [], float $durationMs = 0.0): self
    {
        return new self(HealthStatus::CRITICAL, $message, $metadata, $durationMs);
    }

    public static function unknown(string $message, array $metadata = [], float $durationMs = 0.0): self
    {
        return new self(HealthStatus::UNKNOWN, $message, $metadata, $durationMs);
    }

    // ── Enrichment ────────────────────────────────────────────────────────────

    /**
     * Attach check identity (name, label, group) from the check that produced this result.
     * Called by HealthCheckManager after run() returns.
     */
    public function withCheck(HealthCheckInterface $check): self
    {
        return new self(
            status:     $this->status,
            message:    $this->message,
            metadata:   $this->metadata,
            durationMs: $this->durationMs,
            name:       $check->name(),
            label:      $check->label(),
            group:      $check->group(),
        );
    }

    // ── Output ────────────────────────────────────────────────────────────────

    public function toArray(): array
    {
        return [
            'name'        => $this->name,
            'label'       => $this->label,
            'group'       => $this->group,
            'status'      => $this->status->value,
            'status_label'=> $this->status->label(),
            'color'       => $this->status->color(),
            'message'     => $this->message,
            'duration_ms' => round($this->durationMs, 2),
            'metadata'    => $this->metadata,
        ];
    }
}
