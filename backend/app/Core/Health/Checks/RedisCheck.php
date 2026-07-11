<?php

namespace App\Core\Health\Checks;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use Illuminate\Support\Facades\Redis;

class RedisCheck implements HealthCheckInterface
{
    public function name(): string  { return 'redis'; }
    public function label(): string { return 'Redis Cache'; }
    public function group(): string { return 'system'; }

    public function run(): HealthCheckResult
    {
        // If Redis is not configured, return UNKNOWN (not CRITICAL)
        if (config('cache.default') !== 'redis' && config('queue.default') !== 'redis') {
            return HealthCheckResult::unknown('Redis is not configured as cache or queue driver.');
        }

        try {
            $start  = microtime(true);
            $pong   = Redis::ping();
            $ms     = round((microtime(true) - $start) * 1000, 2);

            $info       = Redis::info('memory');
            $usedMb     = round(($info['used_memory'] ?? 0) / 1024 / 1024, 1);
            $maxMb      = isset($info['maxmemory']) && $info['maxmemory'] > 0
                          ? round($info['maxmemory'] / 1024 / 1024, 1)
                          : null;

            $usagePercent = $maxMb ? round(($usedMb / $maxMb) * 100, 1) : null;

            if ($usagePercent && $usagePercent > 85) {
                return HealthCheckResult::warning(
                    "Redis memory usage high: {$usedMb}MB / {$maxMb}MB ({$usagePercent}%)",
                    ['used_mb' => $usedMb, 'max_mb' => $maxMb, 'usage_percent' => $usagePercent, 'latency_ms' => $ms]
                );
            }

            return HealthCheckResult::ok(
                "Redis responding in {$ms}ms — memory: {$usedMb}MB",
                ['used_mb' => $usedMb, 'max_mb' => $maxMb, 'latency_ms' => $ms]
            );
        } catch (\Throwable $e) {
            return HealthCheckResult::critical(
                'Redis unreachable: ' . $e->getMessage()
            );
        }
    }
}
