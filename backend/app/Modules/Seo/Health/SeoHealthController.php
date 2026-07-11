<?php

namespace App\Modules\Seo\Health;

use App\Http\Controllers\Controller;
use App\Modules\Seo\Jobs\RunSeoAuditJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * SEO Health Controller
 *
 * Admin routes:
 *   GET  /api/v1/admin/seo/health/overview        — aggregate score for Dashboard
 *   GET  /api/v1/admin/seo/health/{type}/{uuid}   — score for a single item
 *   POST /api/v1/admin/seo/health/audit           — dispatch RunSeoAuditJob (extended checks)
 *   GET  /api/v1/admin/seo/health/low-scores      — items with score < 50
 */
class SeoHealthController extends Controller
{
    public function __construct(private SeoHealthChecker $checker) {}

    /**
     * GET /api/v1/admin/seo/health/overview
     *
     * Returns aggregate SEO scores by content type.
     * Fed directly to Module 19 Dashboard SEO widget.
     */
    public function overview(): JsonResponse
    {
        $this->authorize('seo.admin');

        return response()->json($this->checker->overview());
    }

    /**
     * GET /api/v1/admin/seo/health/{type}/{uuid}
     *
     * Run and return a full SEO health check for a specific content item.
     *
     * @param  string  $type  Content type: blog | page | portfolio | case_study | download
     * @param  string  $uuid  UUID of the content item
     */
    public function check(string $type, string $uuid): JsonResponse
    {
        $this->authorize('seo.admin');

        $model = $this->resolveModel($type, $uuid);

        if (!$model) {
            return response()->json(['error' => 'Content not found.'], 404);
        }

        return response()->json($this->checker->check($model)->toArray());
    }

    /**
     * POST /api/v1/admin/seo/health/audit
     *
     * Dispatch the extended SEO audit (broken links, orphan pages, duplicate meta, etc.)
     * as a background job. Results stored in seo_metadata.seo_score after completion.
     */
    public function audit(Request $request): JsonResponse
    {
        $this->authorize('seo.admin');

        $type = $request->input('type'); // null = audit all content

        RunSeoAuditJob::dispatch($type)->onQueue('seo');

        return response()->json([
            'message' => 'SEO audit queued.',
            'type'    => $type ?? 'all',
        ]);
    }

    /**
     * GET /api/v1/admin/seo/health/low-scores
     *
     * Returns content items with seo_score < 50 for admin review.
     */
    public function lowScores(Request $request): JsonResponse
    {
        $this->authorize('seo.admin');

        $threshold = (int) $request->query('threshold', 50);

        $items = DB::table('seo_metadata')
            ->where('seo_score', '<', $threshold)
            ->whereNotNull('seo_score')
            ->select(['seoable_type', 'seoable_id', 'title', 'seo_score', 'last_audited_at'])
            ->orderBy('seo_score')
            ->paginate(50);

        return response()->json($items);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function resolveModel(string $type, string $uuid): ?object
    {
        $modelMap = [
            'blog'       => \App\Modules\Blog\Blog::class,
            'page'       => \App\Modules\Pages\Page::class,
            'portfolio'  => \App\Modules\Portfolio\Portfolio::class,
            'case_study' => \App\Modules\CaseStudy\CaseStudy::class,
            'download'   => \App\Modules\Downloads\Download::class,
        ];

        $class = $modelMap[$type] ?? null;

        if (!$class || !class_exists($class)) {
            return null;
        }

        return $class::where('uuid', $uuid)->first();
    }
}
