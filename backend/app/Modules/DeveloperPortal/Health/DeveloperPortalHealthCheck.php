<?php

namespace App\Modules\DeveloperPortal\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use Illuminate\Support\Facades\Route;

class DeveloperPortalHealthCheck implements HealthCheckInterface
{
    public function name(): string { return 'api_docs_coverage'; }
    public function label(): string { return 'API Documentation Coverage'; }
    public function group(): string { return 'developer_portal'; }

    public function run(): HealthCheckResult
    {
        // 1. Check if the OpenAPI spec file exists (was generated successfully by CI)
        $specPath = storage_path('app/openapi_v1.json');
        
        if (!file_exists($specPath)) {
            return HealthCheckResult::warning('OpenAPI specification (v1) not found. Run api:generate-spec.');
        }

        // 2. Perform a simulated Coverage Check (e.g. Scramble AST vs registered API routes)
        $spec = json_decode(file_get_contents($specPath), true);
        
        // Count registered API routes
        $apiRouteCount = 0;
        foreach (Route::getRoutes() as $route) {
            if (str_starts_with($route->uri(), 'api/v1/')) {
                $apiRouteCount++;
            }
        }

        $documentedRouteCount = count($spec['paths'] ?? []);

        // Avoid division by zero
        $coverage = $apiRouteCount > 0 
            ? round(($documentedRouteCount / $apiRouteCount) * 100) 
            : 100;

        if ($coverage < 90) {
            return HealthCheckResult::warning("API Documentation coverage is low: {$coverage}%. Target is >90%.");
        }

        return HealthCheckResult::ok("API Documentation coverage is healthy: {$coverage}%.");
    }
}
