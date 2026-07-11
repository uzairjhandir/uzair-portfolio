<?php

namespace App\Modules\Seo\Redirects;

use App\Modules\Seo\Jobs\IncrementRedirectHitJob;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Check Redirects Middleware
 *
 * Resolution priority (fastest first):
 *   1. Exact match   — DB index lookup, O(1)
 *   2. Wildcard match — Str::is() on filtered rows
 *   3. Regex match   — preg_match() on filtered rows
 *
 * This middleware runs AFTER routing. When the response is a 404,
 * it checks the redirect table and either redirects or returns 410.
 *
 * Performance:
 *   - Active redirects are cached in Redis/file cache (key: seo:redirects:active)
 *   - Cache is invalidated when a redirect is created/updated/deleted
 *   - Hit counter is incremented asynchronously via IncrementRedirectHitJob
 *
 * Registration:
 *   SeoServiceProvider registers this as a route middleware.
 *   It does NOT run on every request — only on 404 responses.
 */
class CheckRedirectsMiddleware
{
    public function handle(Request $request, Closure $next): mixed
    {
        $response = $next($request);

        // Only process 404 responses
        if ($response->getStatusCode() !== 404) {
            return $response;
        }

        $requestPath = '/' . ltrim($request->getPathInfo(), '/');

        $redirect = $this->resolve($requestPath);

        if (!$redirect) {
            return $response;
        }

        // Track hit asynchronously — never block the redirect itself
        IncrementRedirectHitJob::dispatch($redirect->id)->onQueue('seo');

        // 410 Gone — no redirect
        if ($redirect->isGone()) {
            abort(410, 'Gone');
        }

        return redirect(
            $redirect->resolveTarget($requestPath),
            $redirect->http_code
        );
    }

    /**
     * Resolve a redirect for the given path.
     * Priority: exact → wildcard → regex
     */
    private function resolve(string $path): ?Redirect
    {
        $redirects = $this->loadActiveRedirects();

        // Pass 1: exact match (fastest)
        foreach ($redirects['exact'] as $redirect) {
            if ($redirect->matches($path)) {
                return $redirect;
            }
        }

        // Pass 2: wildcard match
        foreach ($redirects['wildcard'] as $redirect) {
            if ($redirect->matches($path)) {
                return $redirect;
            }
        }

        // Pass 3: regex match (most expensive, last)
        foreach ($redirects['regex'] as $redirect) {
            if ($redirect->matches($path)) {
                return $redirect;
            }
        }

        return null;
    }

    /**
     * Load active redirects from cache, grouped by match_type.
     * Cache is cleared by RedirectController whenever the table changes.
     */
    private function loadActiveRedirects(): array
    {
        return Cache::remember('seo:redirects:active', now()->addHour(), function () {
            $all = Redirect::active()->orderBy('match_type')->get();

            return [
                'exact'    => $all->where('match_type', 'exact'),
                'wildcard' => $all->where('match_type', 'wildcard'),
                'regex'    => $all->where('match_type', 'regex'),
            ];
        });
    }
}
