<?php

namespace App\Modules\Dashboard\Widgets;

use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

/**
 * Queue Monitor Widget
 *
 * Per-queue stats: pending jobs, failed jobs, and age of the oldest job.
 * Queries Laravel's native jobs and failed_jobs tables — no extra dependencies.
 *
 * 15-second TTL gives a near-live feel without hitting the DB on every request.
 */
class QueueMonitorWidget implements DashboardWidgetInterface
{
    private array $monitoredQueues = [
        'default', 'search', 'seo', 'media', 'notifications', 'analytics',
    ];

    public function key(): string   { return 'queue'; }
    public function label(): string { return 'Queue Monitor'; }
    public function priority(): int { return 50; }
    public function cacheTtl(): int { return 15; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('system.monitor');
    }

    public function collect(): array
    {
        $queues = [];

        foreach ($this->monitoredQueues as $queue) {
            $pending = DB::table('jobs')->where('queue', $queue)->count();

            $oldest  = DB::table('jobs')
                ->where('queue', $queue)
                ->orderBy('created_at')
                ->value('created_at');

            $oldestAgeSeconds = $oldest
                ? now()->diffInSeconds(\Carbon\Carbon::parse($oldest))
                : null;

            $queues[$queue] = [
                'pending'              => $pending,
                'oldest_job_age_secs'  => $oldestAgeSeconds,
            ];
        }

        // ── Failed Jobs ───────────────────────────────────────────────────────
        $failedByQueue = DB::table('failed_jobs')
            ->selectRaw('queue, COUNT(*) as count')
            ->groupBy('queue')
            ->pluck('count', 'queue')
            ->toArray();

        foreach ($this->monitoredQueues as $queue) {
            $queues[$queue]['failed'] = (int) ($failedByQueue[$queue] ?? 0);
        }

        return [
            'queues'      => $queues,
            'total_pending' => array_sum(array_column($queues, 'pending')),
            'total_failed'  => array_sum(array_column($queues, 'failed')),
        ];
    }
}
