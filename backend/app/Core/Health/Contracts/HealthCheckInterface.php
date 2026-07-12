<?php

namespace App\Core\Health\Contracts;

use App\Core\Health\HealthCheckResult;

/**
 * Health Check Interface
 *
 * Every health check implements this contract.
 * Checks are registered with HealthCheckManager in each module's ServiceProvider.
 *
 * Pattern mirrors SearchDriverInterface — plug in, collect, done.
 *
 * Future modules add checks without touching Core:
 *   PaymentsServiceProvider::boot() → $manager->register(new PaymentGatewayCheck())
 *   DashboardController calls $manager->collect() → new check appears automatically.
 */
interface HealthCheckInterface
{
    /**
     * Machine-readable identifier. Must be unique across all checks.
     * Examples: 'database', 'redis', 'search_driver', 'seo_score'
     */
    public function name(): string;

    /**
     * Human-readable label for UI display.
     * Examples: 'Database Connection', 'Redis Cache', 'Search Engine'
     */
    public function label(): string;

    /**
     * Grouping for Dashboard section organization.
     * Standard groups: 'system' | 'search' | 'seo' | 'storage' | 'queue'
     * New modules may introduce new groups — no registration required.
     */
    public function group(): string;

    /**
     * Execute the health check and return a result.
     * Must NEVER throw. Catch all exceptions internally and return UNKNOWN.
     */
    public function run(): HealthCheckResult;
}
