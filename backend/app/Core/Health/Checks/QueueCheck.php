<?php

namespace App\Core\Health\Checks;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use Illuminate\Support\Facades\DB;

class QueueCheck implements HealthCheckInterface
{
    // WARNING if any queue has more than this many pending jobs
    private const WARNING_BACKLOG  = 500;
    private const CRITICAL_BACKLOG = 5000;

    // WARNING if any queue has more than this many failed jobs
    private const WARNING_FAILED   = 10;

    public function name(): string  { return 'queue'; }
    public function label(): string { return 'Job Queue'; }
    public function group(): string { return 'system'; }

    public function run(): HealthCheckResult
    {
        try {
            $pending = DB::table('jobs')->count();
            $failed  = DB::table('failed_jobs')->count();

            if ($pending >= self::CRITICAL_BACKLOG) {
                return HealthCheckResult::critical(
                    "Queue backlog critical: {$pending} pending jobs",
                    ['pending' => $pending, 'failed' => $failed]
                );
            }

            if ($pending >= self::WARNING_BACKLOG || $failed >= self::WARNING_FAILED) {
                return HealthCheckResult::warning(
                    "Queue degraded: {$pending} pending, {$failed} failed",
                    ['pending' => $pending, 'failed' => $failed,
                     'warning_backlog' => self::WARNING_BACKLOG, 'warning_failed' => self::WARNING_FAILED]
                );
            }

            return HealthCheckResult::ok(
                "Queue healthy: {$pending} pending, {$failed} failed",
                ['pending' => $pending, 'failed' => $failed]
            );
        } catch (\Throwable $e) {
            return HealthCheckResult::unknown('Queue check failed: ' . $e->getMessage());
        }
    }
}
