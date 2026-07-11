<?php

namespace App\Modules\Search\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\Contracts\HealthStatus;
use App\Core\Health\HealthCheckResult;
use App\Modules\Search\SearchManager;

/**
 * Search Health Check
 *
 * Registered in SearchServiceProvider::boot().
 * Calls SearchManager::health() (already implemented) and translates
 * the result into a HealthCheckResult.
 *
 * Thresholds:
 *   CRITICAL — driver unreachable or > 100 failed documents
 *   WARNING  — queue backlog > 100 or avg query time > 500ms
 *   OK       — all nominal
 */
class SearchHealthCheck implements HealthCheckInterface
{
    public function __construct(private SearchManager $manager) {}

    public function name(): string  { return 'search_engine'; }
    public function label(): string { return 'Search Engine'; }
    public function group(): string { return 'search'; }

    public function run(): HealthCheckResult
    {
        try {
            $health = $this->manager->health();

            $failed  = $health['failed_documents']      ?? 0;
            $backlog = $health['queue_backlog']          ?? 0;
            $avgMs   = $health['average_query_time_ms']  ?? 0;
            $indexed = $health['indexed_documents']      ?? 0;

            if ($failed > 100) {
                return HealthCheckResult::critical(
                    "Search: {$failed} failed documents — index may be corrupt",
                    $health
                );
            }

            if ($backlog > 100 || $avgMs > 500) {
                $reason = $backlog > 100
                    ? "queue backlog: {$backlog} jobs"
                    : "slow queries: avg {$avgMs}ms";

                return HealthCheckResult::warning(
                    "Search degraded — {$reason}",
                    $health
                );
            }

            return HealthCheckResult::ok(
                "Search OK — {$indexed} documents indexed, {$backlog} pending, avg {$avgMs}ms",
                $health
            );
        } catch (\Throwable $e) {
            return HealthCheckResult::critical(
                'Search driver unreachable: ' . $e->getMessage()
            );
        }
    }
}
