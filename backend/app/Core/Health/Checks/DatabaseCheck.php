<?php

namespace App\Core\Health\Checks;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use Illuminate\Support\Facades\DB;

class DatabaseCheck implements HealthCheckInterface
{
    public function name(): string  { return 'database'; }
    public function label(): string { return 'Database Connection'; }
    public function group(): string { return 'system'; }

    public function run(): HealthCheckResult
    {
        try {
            $start = microtime(true);
            DB::select('SELECT 1');
            $ms = round((microtime(true) - $start) * 1000, 2);

            if ($ms > 200) {
                return HealthCheckResult::warning(
                    "Database responding slowly ({$ms}ms)",
                    ['latency_ms' => $ms, 'threshold_ms' => 200]
                );
            }

            return HealthCheckResult::ok(
                "Database responding in {$ms}ms",
                ['latency_ms' => $ms]
            );
        } catch (\Throwable $e) {
            return HealthCheckResult::critical(
                'Database connection failed: ' . $e->getMessage()
            );
        }
    }
}
