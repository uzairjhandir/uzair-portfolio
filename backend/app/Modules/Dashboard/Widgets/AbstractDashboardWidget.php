<?php

namespace App\Modules\Dashboard\Widgets;

use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Base Dashboard Widget
 * Provides sensible defaults for the enterprise widget interface.
 */
abstract class AbstractDashboardWidget implements DashboardWidgetInterface
{
    public function cacheTtl(): int { return 60; }
    
    public function supportsRealtime(): bool { return false; }
    
    public function pollInterval(): int { return 60; }
    
    public function icon(): string { return 'activity'; }
    
    public function canExport(Authenticatable $user): bool { return false; }
    
    public function canRefresh(Authenticatable $user): bool { return $user->can('system.admin'); }
}
