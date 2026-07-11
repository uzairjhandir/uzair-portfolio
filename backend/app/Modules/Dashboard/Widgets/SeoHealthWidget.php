<?php

namespace App\Modules\Dashboard\Widgets;

use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use App\Modules\Seo\Health\SeoHealthChecker;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

/**
 * SEO Health Widget
 *
 * Extends SeoHealthChecker::overview() with additional dashboard-specific
 * SEO signals: missing titles, descriptions, noindex count, redirect chains.
 */
class SeoHealthWidget implements DashboardWidgetInterface
{
    public function __construct(private SeoHealthChecker $checker) {}

    public function key(): string   { return 'seo_health'; }
    public function label(): string { return 'SEO Health'; }
    public function priority(): int { return 40; }
    public function cacheTtl(): int { return 300; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('seo.admin');
    }

    public function collect(): array
    {
        $overview = $this->checker->overview();

        // ── Grade distribution ────────────────────────────────────────────────
        $grades = DB::table('seo_metadata')
            ->whereNotNull('seo_score')
            ->selectRaw("
                SUM(CASE WHEN seo_score >= 90 THEN 1 ELSE 0 END) as a,
                SUM(CASE WHEN seo_score >= 80 AND seo_score < 90 THEN 1 ELSE 0 END) as b,
                SUM(CASE WHEN seo_score >= 70 AND seo_score < 80 THEN 1 ELSE 0 END) as c,
                SUM(CASE WHEN seo_score >= 50 AND seo_score < 70 THEN 1 ELSE 0 END) as d,
                SUM(CASE WHEN seo_score < 50 THEN 1 ELSE 0 END) as f
            ")
            ->first();

        // ── Gaps ──────────────────────────────────────────────────────────────
        $missingTitles       = DB::table('seo_metadata')->whereNull('title')->count();
        $missingDescriptions = DB::table('seo_metadata')->whereNull('description')->count();
        $missingCanonicals   = DB::table('seo_metadata')->whereNull('canonical_url')->count();
        $noindexPages        = DB::table('seo_metadata')
            ->where('robots', 'like', '%noindex%')
            ->count();

        // ── Broken redirect chains ────────────────────────────────────────────
        // A redirect chain exists when redirect A's target = redirect B's source.
        // This is a JOIN-based detection — exact pairs only.
        $redirectChains = DB::table('redirects as a')
            ->join('redirects as b', 'a.target_path', '=', 'b.source_path')
            ->where('a.is_active', true)
            ->where('b.is_active', true)
            ->count();

        return array_merge($overview, [
            'grades' => [
                'A' => (int) ($grades->a ?? 0),
                'B' => (int) ($grades->b ?? 0),
                'C' => (int) ($grades->c ?? 0),
                'D' => (int) ($grades->d ?? 0),
                'F' => (int) ($grades->f ?? 0),
            ],
            'gaps' => [
                'missing_titles'       => $missingTitles,
                'missing_descriptions' => $missingDescriptions,
                'missing_canonicals'   => $missingCanonicals,
                'noindex_pages'        => $noindexPages,
                'redirect_chains'      => $redirectChains,
            ],
        ]);
    }
}
