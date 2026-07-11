<?php

namespace App\Modules\Notifications\Widgets;

use App\Modules\Dashboard\Widgets\AbstractDashboardWidget;
use App\Modules\Notifications\Models\NotificationLog;
use Illuminate\Contracts\Auth\Authenticatable;

class NotificationsWidget extends AbstractDashboardWidget
{
    public function key(): string   { return 'notifications'; }
    public function label(): string { return 'Notifications Engine'; }
    public function priority(): int { return 55; }
    public function cacheTtl(): int { return 60; }
    public function icon(): string  { return 'bell'; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('system.monitor');
    }

    public function collect(): array
    {
        $last24Hours = now()->subHours(24);

        $counts = NotificationLog::query()
            ->selectRaw('status, count(*) as count')
            ->where('created_at', '>=', $last24Hours)
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Calculate average delivery time (sent_at - queued_at) for the last 24 hours
        $avgDeliveryTimeSeconds = NotificationLog::query()
            ->whereNotNull('sent_at')
            ->where('created_at', '>=', $last24Hours)
            ->selectRaw('AVG(TIMESTAMPDIFF(SECOND, queued_at, sent_at)) as avg_sec')
            ->value('avg_sec');

        return [
            'period'  => 'Last 24 Hours',
            'metrics' => [
                'queued'    => $counts['queued'] ?? 0,
                'sending'   => $counts['sending'] ?? 0,
                'delivered' => $counts['delivered'] ?? 0,
                'opened'    => $counts['opened'] ?? 0,
                'clicked'   => $counts['clicked'] ?? 0,
                'retrying'  => $counts['retried'] ?? 0,
                'failed'    => $counts['failed'] ?? 0, // DLQ conceptually
            ],
            'performance' => [
                'avg_delivery_time_sec' => (int) $avgDeliveryTimeSeconds,
            ]
        ];
    }
}
