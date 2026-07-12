<?php

namespace App\Modules\Production\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class HealthEndpointController
{
    /**
     * GET /health/live
     * Lightweight probe for Load Balancers (AWS ALB, Kubernetes Liveness Probe).
     * If PHP and the webserver are responding, this returns 200.
     */
    public function live(): JsonResponse
    {
        return response()->json(['status' => 'ok']);
    }

    /**
     * GET /health/ready
     * Deep check for Traffic Routers (Kubernetes Readiness Probe).
     * Fails if the DB or Redis is unreachable.
     */
    public function ready(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            Redis::connection()->ping();
        } catch (\Exception $e) {
            return response()->json(['status' => 'unavailable', 'reason' => $e->getMessage()], 503);
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * GET /health/startup
     * Used right after deployment to ensure migrations ran and cache is warmed.
     */
    public function startup(): JsonResponse
    {
        // Example logic: Check if a flag 'deployment_completed' is set in Cache
        $isWarmed = cache()->get('system_warmed', false);

        if (!$isWarmed) {
            return response()->json(['status' => 'warming_up'], 503);
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * GET /health/details
     * Protected endpoint for full system breakdown (Dashboard Integration).
     */
    public function details(): JsonResponse
    {
        // Authenticated users only, or internal network IPs only.
        $manager = app(\App\Core\Health\HealthCheckManager::class);
        $report  = $manager->collect();

        return response()->json($report->toArray());
    }
}
