<?php

namespace App\Modules\Automation\Widgets;

use App\Core\Automation\Enums\RunStatusEnum;
use App\Modules\Automation\Models\WorkflowRun;
use App\Modules\Dashboard\Widgets\AbstractDashboardWidget;
use Illuminate\Contracts\Auth\Authenticatable;

class AutomationWidget extends AbstractDashboardWidget
{
    public function key(): string   { return 'automation_engine'; }
    public function label(): string { return 'Automation Engine'; }
    public function priority(): int { return 60; }
    public function cacheTtl(): int { return 60; }
    public function icon(): string  { return 'git-merge'; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('system.monitor');
    }

    public function collect(): array
    {
        $last24Hours = now()->subHours(24);

        $counts = WorkflowRun::query()
            ->selectRaw('status, count(*) as count')
            ->where('created_at', '>=', $last24Hours)
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $totalRuns = array_sum($counts);
        $successCount = $counts[RunStatusEnum::COMPLETED->value] ?? 0;
        $failedCount = $counts[RunStatusEnum::FAILED->value] ?? 0;
        
        $successRate = $totalRuns > 0 ? round(($successCount / $totalRuns) * 100, 1) : 100;

        return [
            'period'  => 'Last 24 Hours',
            'metrics' => [
                'running_now' => $counts[RunStatusEnum::RUNNING->value] ?? 0,
                'paused'      => $counts[RunStatusEnum::PAUSED->value] ?? 0,
                'retrying'    => $counts[RunStatusEnum::RETRYING->value] ?? 0,
                'completed'   => $successCount,
                'failed'      => $failedCount,
            ],
            'kpis' => [
                'success_rate' => $successRate . '%',
            ]
        ];
    }
}
