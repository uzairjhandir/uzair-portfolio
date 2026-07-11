<?php

namespace App\Core\Health\Checks;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use Illuminate\Support\Facades\Cache;

class CacheCheck implements HealthCheckInterface
{
    private const TEST_KEY = '_health:cache_roundtrip';

    public function name(): string  { return 'cache'; }
    public function label(): string { return 'Cache Layer'; }
    public function group(): string { return 'system'; }

    public function run(): HealthCheckResult
    {
        try {
            $expected = 'health_ok_' . time();

            $start = microtime(true);
            Cache::put(self::TEST_KEY, $expected, 10);
            $actual = Cache::get(self::TEST_KEY);
            $ms     = round((microtime(true) - $start) * 1000, 2);

            Cache::forget(self::TEST_KEY);

            if ($actual !== $expected) {
                return HealthCheckResult::critical(
                    'Cache round-trip failed — written value does not match read value.',
                    ['driver' => config('cache.default')]
                );
            }

            return HealthCheckResult::ok(
                "Cache round-trip successful in {$ms}ms (driver: " . config('cache.default') . ')',
                ['driver' => config('cache.default'), 'latency_ms' => $ms]
            );
        } catch (\Throwable $e) {
            return HealthCheckResult::critical('Cache check failed: ' . $e->getMessage());
        }
    }
}
