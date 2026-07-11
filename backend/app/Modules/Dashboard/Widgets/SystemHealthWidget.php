<?php

namespace App\Modules\Dashboard\Widgets;

use App\Core\Health\HealthCheckManager;
use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * System Health Widget
 *
 * Calls HealthCheckManager::collect() and returns the full HealthReport.
 * All checks registered by every module are included automatically.
 */
class SystemHealthWidget implements DashboardWidgetInterface
{
    public function __construct(private HealthCheckManager $manager) {}

    public function key(): string   { return 'system_health'; }
    public function label(): string { return 'System Health'; }
    public function priority(): int { return 20; }
    public function cacheTtl(): int { return 30; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('system.monitor');
    }

    public function collect(): array
    {
        return $this->manager->collect()->toArray();
    }
}
