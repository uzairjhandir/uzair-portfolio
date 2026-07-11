<?php

namespace App\Core\Health;

use App\Core\Health\Contracts\HealthStatus;

/**
 * Health Report — DTO
 *
 * Returned by HealthCheckManager::collect().
 * Contains all check results, overall score, and group breakdown.
 *
 * Score calculation:
 *   Each check contributes its HealthStatus::score() (OK=100, WARNING=50, CRITICAL/UNKNOWN=0).
 *   Overall score = average of all check scores.
 *
 * Groups:
 *   Results are organized by HealthCheckInterface::group() for dashboard sectioning.
 *   New groups appear automatically when new checks register with a new group string.
 */
final class HealthReport
{
    /** @var HealthCheckResult[] */
    private array $results;

    private int   $score;
    private HealthStatus $status;

    public function __construct(array $results)
    {
        $this->results = $results;
        $this->score   = $this->computeScore();
        $this->status  = $this->computeStatus();
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    public function score(): int            { return $this->score; }
    public function status(): HealthStatus  { return $this->status; }

    /** @return HealthCheckResult[] */
    public function results(): array        { return $this->results; }

    public function total(): int            { return count($this->results); }

    public function passing(): int
    {
        return count(array_filter($this->results, fn($r) => $r->status === HealthStatus::OK));
    }

    public function warnings(): int
    {
        return count(array_filter($this->results, fn($r) => $r->status === HealthStatus::WARNING));
    }

    public function critical(): int
    {
        return count(array_filter($this->results, fn($r) => $r->status === HealthStatus::CRITICAL));
    }

    public function unknown(): int
    {
        return count(array_filter($this->results, fn($r) => $r->status === HealthStatus::UNKNOWN));
    }

    /**
     * Results grouped by their group string.
     * @return array<string, HealthCheckResult[]>
     */
    public function byGroup(): array
    {
        $groups = [];
        foreach ($this->results as $result) {
            $group           = $result->group ?? 'system';
            $groups[$group][] = $result;
        }
        return $groups;
    }

    // ── Serialization ─────────────────────────────────────────────────────────

    public function toArray(): array
    {
        return [
            'score'    => $this->score,
            'status'   => $this->status->value,
            'label'    => $this->status->label(),
            'color'    => $this->status->color(),
            'total'    => $this->total(),
            'passing'  => $this->passing(),
            'warnings' => $this->warnings(),
            'critical' => $this->critical(),
            'unknown'  => $this->unknown(),
            'groups'   => array_map(
                fn($results) => array_map(fn($r) => $r->toArray(), $results),
                $this->byGroup()
            ),
            'checks'   => array_map(fn($r) => $r->toArray(), $this->results),
        ];
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private function computeScore(): int
    {
        if (empty($this->results)) {
            return 100;
        }

        $total = array_sum(array_map(fn($r) => $r->status->score(), $this->results));
        return (int) round($total / count($this->results));
    }

    private function computeStatus(): HealthStatus
    {
        $status = HealthStatus::OK;

        foreach ($this->results as $result) {
            $status = $status->worst($result->status);
        }

        return $status;
    }
}
