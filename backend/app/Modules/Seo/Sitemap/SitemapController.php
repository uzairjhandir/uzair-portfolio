<?php

namespace App\Modules\Seo\Sitemap;

use App\Http\Controllers\Controller;
use App\Modules\Seo\Jobs\GenerateSitemapJob;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Sitemap Controller
 *
 * Serves pre-generated XML files from storage/app/sitemaps/.
 *
 * Public routes:
 *   GET /sitemap.xml              → master index (or single sitemap)
 *   GET /sitemap-index.xml        → explicit sitemap index
 *   GET /sitemap-{section}.xml    → blog, pages, portfolio, case-studies, downloads, taxonomy, authors
 *
 * Admin route:
 *   POST /api/v1/admin/seo/sitemap/rebuild  → dispatch GenerateSitemapJob
 */
class SitemapController extends Controller
{
    public function __construct(private SitemapEngine $engine) {}

    // ── Public ────────────────────────────────────────────────────────────────

    public function index(): Response|BinaryFileResponse
    {
        return $this->serveFile('sitemap.xml');
    }

    public function sitemapIndex(): Response|BinaryFileResponse
    {
        return $this->serveFile('sitemap-index.xml');
    }

    public function section(string $section): Response|BinaryFileResponse
    {
        // Sanitize: only allow alphanumeric + hyphen section names
        if (!preg_match('/^[a-z0-9\-]+$/', $section)) {
            abort(404);
        }

        return $this->serveFile("sitemap-{$section}.xml");
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/admin/seo/sitemap/rebuild
     *
     * Dispatch a full or partial sitemap rebuild to the queue.
     */
    public function rebuild(Request $request): \Illuminate\Http\JsonResponse
    {
        $this->authorize('seo.admin');

        $section = $request->input('section'); // null = full rebuild

        GenerateSitemapJob::dispatch($section)->onQueue('seo');

        return response()->json([
            'message' => 'Sitemap rebuild queued.',
            'section' => $section ?? 'all',
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function serveFile(string $filename): Response|BinaryFileResponse
    {
        $path = $this->engine->filePath($filename);

        if (!$this->engine->exists($filename)) {
            // File not generated yet — trigger on-the-fly generation and retry once
            $section = str_replace(['sitemap-', '.xml'], '', $filename);
            $this->engine->generate($section === 'sitemap' || $section === 'index' ? null : $section);

            if (!$this->engine->exists($filename)) {
                abort(404, 'Sitemap not available.');
            }
        }

        return response()->file($path, [
            'Content-Type'  => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
            'X-Robots-Tag'  => 'noindex',
        ]);
    }
}
