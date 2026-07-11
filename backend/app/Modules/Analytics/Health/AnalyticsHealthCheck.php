<?php

namespace App\Modules\Analytics\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use App\Modules\Analytics\AnalyticsManager;

class AnalyticsHealthCheck implements HealthCheckInterface
{
    public function __construct(private AnalyticsManager $manager) {}

    public function name(): string
    {
        return 'analytics_driver';
    }

    public function label(): string
    {
        return 'Analytics Engine';
    }

    public function group(): string
    {
        return 'analytics';
    }

    public function run(): HealthCheckResult
    {
        try {
            $driver = $this->manager->driver();
            
            if ($driver->name() === 'null') {
                return HealthCheckResult::warning('Null driver is active. No analytics will be tracked.');
            }

            return $driver->health();
        } catch (\Throwable $e) {
            return HealthCheckResult::critical('Analytics Engine failed: ' . $e->getMessage());
        }
    }
}
