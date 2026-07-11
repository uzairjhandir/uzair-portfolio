<?php

namespace App\Modules\Production\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RequestProfilerMiddleware
{
    /**
     * Handle an incoming request and profile performance.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage(true);
        
        // Ensure query logging is enabled temporarily if we wanted to count exactly,
        // or we rely on Laravel Telescope / Clockwork in non-prod. In prod, we just measure time & memory.

        $response = $next($request);

        $durationMs = (microtime(true) - $startTime) * 1000;
        $memoryPeakMb = memory_get_peak_usage(true) / 1024 / 1024;

        $logData = [
            'method'     => $request->method(),
            'url'        => $request->fullUrl(),
            'ip'         => $request->ip(),
            'status'     => $response->getStatusCode(),
            'duration'   => round($durationMs, 2) . 'ms',
            'memory'     => round($memoryPeakMb, 2) . 'MB',
        ];

        // Only log slow requests (e.g., > 500ms) or log everything to a dedicated stream
        if ($durationMs > 500) {
            Log::channel('performance')->warning('Slow Request Detected', $logData);
        } else {
            // Optional: Log all in a high-volume ELK/Datadog setup
            Log::channel('performance')->debug('Request Profile', $logData);
        }

        // Attach non-sensitive metrics to response headers (optional but helpful for DX)
        $response->headers->set('X-Response-Time', round($durationMs, 2) . 'ms');
        
        return $response;
    }
}
