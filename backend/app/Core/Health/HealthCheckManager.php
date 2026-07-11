<?php

namespace App\Core\Health;

use App\Core\Health\Contracts\HealthCheckInterface;

/**
 * Health Check Manager
 *
 * Singleton. Collects health checks from all registered sources.
 * Mirrors the SearchManager pattern exactly:
 *   register() → collect() → HealthReport
 *
 * Registration:
 *   Each module's ServiceProvider::boot() calls:
 *   $manager->register(new MyModuleCheck());
 *
 *   Core checks are registered in CoreHealthServiceProvider.
 *   Module checks are registered in their own ServiceProvider.
 *   The Dashboard never knows what modules exist — it just calls collect().
 *
 * Usage:
 *   $report = app(HealthCheckManager::class)->collect();
 *   return response()->json($report->toArray());
 */
class HealthCheckManager
{
    /** @var HealthCheckInterface[] */
    private array $checks = [];

    public function register(HealthCheckInterface $check): void
    {
        $this->checks[$check->name()] = $check;
    }

    /**
     * @return HealthCheckInterface[]
     */
    public function all(): array
    {
        return $this->checks;
    }

    /**
     * Run all registered checks and return a HealthReport.
     *
     * Each check:
     *   1. Is timed with microtime()
     *   2. Has its result enriched with name/label/group
     *   3. Any exception is caught → UNKNOWN result (check must never crash the dashboard)
     */
    public function collect(): HealthReport
    {
        $results = [];

        foreach ($this->checks as $check) {
            $start = microtime(true);

            try {
                $result = $check->run();
            } catch (\Throwable $e) {
                $result = HealthCheckResult::unknown(
                    "Check threw an exception: {$e->getMessage()}"
                );
            }

            $durationMs = round((microtime(true) - $start) * 1000, 2);

            // Enrich the result with check identity + actual timing
            $result = new HealthCheckResult(
                status:     $result->status,
                message:    $result->message,
                metadata:   $result->metadata,
                durationMs: $durationMs,
                name:       $check->name(),
                label:      $check->label(),
                group:      $check->group(),
            );

            $results[] = $result;
        }

        return new HealthReport($results);
    }

    /**
     * Run checks for a specific group only.
     * Used for widget-level refresh (e.g. System Health widget refresh without re-running SEO checks).
     */
    public function collectGroup(string $group): HealthReport
    {
        $filtered = array_filter($this->checks, fn($c) => $c->group() === $group);
        $manager  = new static();

        foreach ($filtered as $check) {
            $manager->register($check);
        }

        return $manager->collect();
    }

    /**
     * Run a single check by name.
     */
    public function run(string $name): ?HealthCheckResult
    {
        if (!isset($this->checks[$name])) {
            return null;
        }

        $check = $this->checks[$name];
        $start = microtime(true);

        try {
            $result = $check->run();
        } catch (\Throwable $e) {
            $result = HealthCheckResult::unknown("Exception: {$e->getMessage()}");
        }

        return new HealthCheckResult(
            status:     $result->status,
            message:    $result->message,
            metadata:   $result->metadata,
            durationMs: round((microtime(true) - $start) * 1000, 2),
            name:       $check->name(),
            label:      $check->label(),
            group:      $check->group(),
        );
    }
}
