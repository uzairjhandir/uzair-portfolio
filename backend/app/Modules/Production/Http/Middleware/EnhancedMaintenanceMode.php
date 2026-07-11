<?php

namespace App\Modules\Production\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnhancedMaintenanceMode
{
    /**
     * Handle an incoming request.
     * Replaces the default CheckForMaintenanceMode with Enterprise features.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!app()->isDownForMaintenance()) {
            return $next($request);
        }

        $data = json_decode(file_get_contents(storage_path('framework/down')), true);

        // 1. Secret URL Bypass
        if (isset($data['secret']) && $request->path() === $data['secret']) {
            return $this->bypassResponse($data['secret']);
        }

        if ($this->hasBypassCookie($request, $data['secret'] ?? null)) {
            return $next($request);
        }

        // 2. IP Allowlist
        $allowedIps = ['127.0.0.1']; // Would fetch from Settings or Env
        if (in_array($request->ip(), $allowedIps)) {
            return $next($request);
        }

        // 3. Role Allowlist (If auth is already resolved, though tricky in early middleware)
        if (auth()->check() && auth()->user()->hasRole('admin')) {
            return $next($request);
        }

        // 4. Custom JSON Response for APIs
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'error' => 'maintenance_mode',
                'message' => $data['message'] ?? 'Service is down for maintenance.',
                'eta' => '15 minutes', // Custom metadata
            ], 503, ['Retry-After' => $data['retry'] ?? 60]);
        }

        // Let Laravel handle standard HTML maintenance views
        throw new \Symfony\Component\HttpKernel\Exception\HttpException(503, "Service Unavailable");
    }

    protected function bypassResponse(string $secret)
    {
        return redirect('/')->withCookie(cookie('laravel_maintenance', $secret, 43200));
    }

    protected function hasBypassCookie(Request $request, ?string $secret): bool
    {
        return $secret && $request->cookie('laravel_maintenance') === $secret;
    }
}
