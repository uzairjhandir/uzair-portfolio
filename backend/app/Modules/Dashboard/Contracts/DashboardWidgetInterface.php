<?php

namespace App\Modules\Dashboard\Contracts;

use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Dashboard Widget Interface
 *
 * Every Dashboard widget implements this contract.
 * DashboardController collects all widgets, filters by visibleFor(),
 * sorts by priority(), then calls collect() on each.
 *
 * Adding a new widget:
 *   1. Create a class implementing this interface in Widgets/
 *   2. Register it in DashboardServiceProvider::boot()
 *   3. Dashboard automatically includes it — no controller changes needed.
 */
interface DashboardWidgetInterface
{
    /**
     * Machine-readable identifier — used as the JSON response key.
     * Examples: 'kpis', 'system_health', 'queue', 'seo_health'
     */
    public function key(): string;

    /**
     * Human-readable label for the admin UI widget header.
     */
    public function label(): string;

    /**
     * Sort order on the dashboard. Lower number = rendered first.
     * Standard priorities: 10 (KPIs), 20 (Health), 30 (Search)... 80 (Modules)
     * Custom widgets can use any integer — no registration required.
     */
    public function priority(): int;

    /**
     * RBAC gate — return false to hide this widget from the user entirely.
     * The permission check runs BEFORE collect() — no expensive queries for unauthorized users.
     *
     * Examples:
     *   return $user->can('system.monitor');
     *   return $user->can('seo.admin');
     *   return $user->hasAnyRole(['admin', 'editor']);
     */
    public function visibleFor(Authenticatable $user): bool;

    /**
     * Collect and return the widget's data payload.
     * Called only if visibleFor() returns true.
     *
     * Return type: plain array (DashboardController handles JSON encoding).
     *
     * Performance: implement cacheTtl() > 0 to enable automatic caching.
     */
    public function collect(): array;

    /**
     * Cache TTL in seconds. Return 0 to disable caching.
     * DashboardController wraps collect() in Cache::remember() using this TTL.
     *
     * Recommended:
     *   KPIs:          60 seconds
     *   System Health: 30 seconds
     *   Queue Monitor: 15 seconds
     *   SEO Health:    300 seconds
     */
    public function cacheTtl(): int;

    /**
     * Does this widget support real-time polling?
     */
    public function supportsRealtime(): bool;

    /**
     * Recommended polling interval in seconds for real-time widgets.
     * e.g., 5 for Queue Monitor, 600 for Storage.
     */
    public function pollInterval(): int;

    /**
     * UI icon identifier (e.g., Lucide or Heroicon name).
     */
    public function icon(): string;

    /**
     * Can the current user export this widget's data (e.g., CSV)?
     */
    public function canExport(Authenticatable $user): bool;

    /**
     * Can the current user forcefully refresh this widget's cache?
     */
    public function canRefresh(Authenticatable $user): bool;
}
