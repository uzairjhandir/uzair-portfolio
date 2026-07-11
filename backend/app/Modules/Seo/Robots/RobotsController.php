<?php

namespace App\Modules\Seo\Robots;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

/**
 * Robots Controller
 *
 * Serves a dynamic robots.txt driven by the Settings module.
 *
 * Route: GET /robots.txt  (public, no auth)
 *
 * Rules are stored in the settings table under key 'seo.robots_disallow'
 * as a JSON array of paths. If the key is missing, sensible defaults apply.
 *
 * Settings key format:
 *   key: seo.robots_disallow
 *   value: ["/admin", "/api/", "/preview/", "/_next/"]
 */
class RobotsController extends Controller
{
    public function serve(): Response
    {
        $appUrl   = rtrim(config('app.url'), '/');
        $env      = config('app.env');

        // Production: standard rules; staging/local: block everything
        if ($env !== 'production') {
            $content = "User-agent: *\nDisallow: /\n\n# Non-production environment — crawling blocked.\n";
            return response($content, 200)->header('Content-Type', 'text/plain');
        }

        $disallowPaths = $this->loadDisallowPaths();

        $lines = [
            'User-agent: *',
            'Allow: /',
            '',
        ];

        foreach ($disallowPaths as $path) {
            $lines[] = 'Disallow: ' . $path;
        }

        $lines[] = '';
        $lines[] = 'Crawl-delay: 1';
        $lines[] = '';
        $lines[] = 'Sitemap: ' . $appUrl . '/sitemap.xml';

        $content = implode("\n", $lines) . "\n";

        return response($content, 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    private function loadDisallowPaths(): array
    {
        $default = ['/admin', '/api/', '/preview/', '/_next/', '/.well-known'];

        try {
            $setting = DB::table('settings')
                ->where('key', 'seo.robots_disallow')
                ->value('value');

            if ($setting) {
                $decoded = json_decode($setting, true);
                return is_array($decoded) ? $decoded : $default;
            }
        } catch (\Throwable) {
            // Settings table may not exist in test environments
        }

        return $default;
    }
}
