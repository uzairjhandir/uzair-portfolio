<?php

namespace App\Modules\Seo\UrlRewrites;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Check URL Rewrites Middleware
 *
 * Runs BEFORE routing to transparently rewrite the incoming path.
 * The client's address bar never changes — only the server resolves differently.
 *
 * Order matters:
 *   CheckUrlRewritesMiddleware → Router → CheckRedirectsMiddleware (404 fallback)
 *
 * Priority column on url_rewrites: lower number = evaluated first.
 * Cache is keyed separately from redirects.
 */
class CheckUrlRewritesMiddleware
{
    public function handle(Request $request, Closure $next): mixed
    {
        $requestPath = '/' . ltrim($request->getPathInfo(), '/');

        $rewrite = $this->resolve($requestPath);

        if ($rewrite) {
            // Rewrite the request path internally (no response — just changes server routing)
            $request->server->set('REQUEST_URI', $rewrite->resolveTarget($requestPath));
            $request->initialize(
                $request->query->all(),
                $request->request->all(),
                $request->attributes->all(),
                $request->cookies->all(),
                $request->files->all(),
                $request->server->all(),
                $request->getContent()
            );
        }

        return $next($request);
    }

    private function resolve(string $path): ?UrlRewrite
    {
        $rewrites = Cache::remember('seo:rewrites:active', now()->addHour(), function () {
            return UrlRewrite::active()->get();
        });

        foreach ($rewrites as $rewrite) {
            if ($rewrite->matches($path)) {
                return $rewrite;
            }
        }

        return null;
    }
}
