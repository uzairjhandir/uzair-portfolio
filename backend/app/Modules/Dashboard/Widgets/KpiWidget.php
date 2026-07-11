<?php

namespace App\Modules\Dashboard\Widgets;

use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

/**
 * KPI Widget
 *
 * Provides the top-level executive metrics for the dashboard.
 * Pure database aggregation — no external service calls.
 *
 * All counts are sourced from existing module tables.
 * Adding a new KPI = add a line to collect(). No interface changes.
 */
class KpiWidget extends AbstractDashboardWidget
{
    public function key(): string      { return 'kpis'; }
    public function label(): string    { return 'Executive KPIs'; }
    public function cacheTtl(): int    { return 60; }
    public function icon(): string     { return 'bar-chart-2'; }
    public function canExport(Authenticatable $user): bool { return $user->can('dashboard.export'); }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('dashboard.view');
    }

    public function collect(): array
    {
        // ── Content ────────────────────────────────────────────────────────────
        $tables = ['blogs', 'pages', 'portfolios', 'case_studies', 'downloads'];

        $published = $draft = $scheduled = 0;

        foreach ($tables as $table) {
            if (!\Illuminate\Support\Facades\Schema::hasTable($table)) {
                continue;
            }
            $published += DB::table($table)->where('status', 'published')->whereNull('deleted_at')->count();
            $draft     += DB::table($table)->where('status', 'draft')->whereNull('deleted_at')->count();
            $scheduled += DB::table($table)->where('status', 'scheduled')->whereNull('deleted_at')->count();
        }

        // ── Users & Sessions ──────────────────────────────────────────────────
        $totalUsers     = DB::table('users')->count();
        $activeSessions = DB::table('sessions')
            ->where('last_activity', '>', now()->subHours(24)->timestamp)
            ->count();

        // ── CRM ───────────────────────────────────────────────────────────────
        $crmLeadsNew = DB::table('crm_contacts')->where('status', 'new')->count();

        // ── Newsletter ────────────────────────────────────────────────────────
        $subscribers = DB::table('newsletter_subscribers')
            ->where('status', 'confirmed')
            ->count();

        // ── Downloads (30 days) ───────────────────────────────────────────────
        $downloadCount = DB::table('content_metrics')
            ->where('updated_at', '>=', now()->subDays(30))
            ->sum('downloads');

        // ── Media Storage ─────────────────────────────────────────────────────
        $totalBytes     = DB::table('media')->sum('size');
        $storageGb      = round($totalBytes / 1024 / 1024 / 1024, 2);

        // ── Search Index ──────────────────────────────────────────────────────
        $searchIndexSize = DB::table('search_index')->count();

        return [
            'content' => [
                'published' => $published,
                'draft'     => $draft,
                'scheduled' => $scheduled,
                'total'     => $published + $draft + $scheduled,
            ],
            'users' => [
                'total'           => $totalUsers,
                'active_sessions' => $activeSessions,
            ],
            'crm' => [
                'new_leads' => $crmLeadsNew,
            ],
            'newsletter' => [
                'subscribers' => $subscribers,
            ],
            'downloads_30d'    => (int) $downloadCount,
            'storage_gb'       => $storageGb,
            'search_index_size' => $searchIndexSize,
        ];
    }
}
