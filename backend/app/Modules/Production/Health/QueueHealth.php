<?php

namespace App\Modules\Production\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use Illuminate\Support\Facades\Redis;

class QueueHealth implements HealthCheckInterface
{
    public function name(): string { return 'queue_backlog'; }
    public function label(): string { return 'Queue Backlog (Horizon)'; }
    public function group(): string { return 'infrastructure'; }

    public function run(): HealthCheckResult
    {
        // Horizon exposes queue metrics via Redis keys. 
        // We'll simulate fetching the total pending jobs length.
        $pendingJobs = Redis::connection()->llen('queues:default'); // Standard redis fallback

        // Using user defined severity: Healthy (0-200), Warning (201-500), Critical (>500)
        if ($pendingJobs > 500) {
            return HealthCheckResult::critical("Queue backlog is critical: {$pendingJobs} jobs.");
        }

        if ($pendingJobs > 200) {
            return HealthCheckResult::warning("Queue backlog is building up: {$pendingJobs} jobs.");
        }

        return HealthCheckResult::ok("Queue is healthy: {$pendingJobs} jobs pending.");
    }
}
