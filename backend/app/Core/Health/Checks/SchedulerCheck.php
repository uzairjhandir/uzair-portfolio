<?php

namespace App\Core\Health\Checks;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use Illuminate\Support\Facades\Cache;

/**
 * Scheduler Check
 *
 * Verifies that the Laravel Scheduler is running.
 *
 * Strategy:
 *   The scheduler writes a heartbeat cache key every run (every minute via Module 22).
 *   This check reads the key and verifies it was updated within the last 5 minutes.
 *
 * If the scheduler has never run (fresh install), returns WARNING (not CRITICAL).
 * If the key is stale (> 5 minutes old), returns CRITICAL.
 *
 * Module 22 writes: Cache::put('scheduler:heartbeat', now(), 300)
 */
class SchedulerCheck implements HealthCheckInterface
{
    private const HEARTBEAT_KEY    = 'scheduler:heartbeat';
    private const STALE_THRESHOLD  = 5; // minutes

    public function name(): string  { return 'scheduler'; }
    public function label(): string { return 'Task Scheduler'; }
    public function group(): string { return 'system'; }

    public function run(): HealthCheckResult
    {
        try {
            $heartbeat = Cache::get(self::HEARTBEAT_KEY);

            if ($heartbeat === null) {
                return HealthCheckResult::warning(
                    'Scheduler heartbeat not found — is `php artisan schedule:run` configured?',
                    ['heartbeat_key' => self::HEARTBEAT_KEY]
                );
            }

            $lastSeen = \Carbon\Carbon::parse($heartbeat);
            $ageMin   = $lastSeen->diffInMinutes(now());

            if ($ageMin > self::STALE_THRESHOLD) {
                return HealthCheckResult::critical(
                    "Scheduler last ran {$ageMin} minutes ago (threshold: " . self::STALE_THRESHOLD . "m)",
                    ['last_heartbeat' => $lastSeen->toIso8601String(), 'age_minutes' => $ageMin]
                );
            }

            return HealthCheckResult::ok(
                "Scheduler running — last heartbeat {$ageMin} minute(s) ago",
                ['last_heartbeat' => $lastSeen->toIso8601String(), 'age_minutes' => $ageMin]
            );
        } catch (\Throwable $e) {
            return HealthCheckResult::unknown('Scheduler check failed: ' . $e->getMessage());
        }
    }
}
