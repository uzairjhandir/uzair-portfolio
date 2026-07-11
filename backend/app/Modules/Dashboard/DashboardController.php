<?php

namespace App\Modules\Dashboard;

use App\Http\Controllers\Controller;
use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/**
 * Dashboard Controller
 *
 * Dynamically resolves all tagged widgets.
 * Sorts by priority(), filters by visibleFor(), and wraps collect() in Cache::remember().
 *
 * This controller NEVER needs to be modified when a new widget is added.
 */
class DashboardController extends Controller
{
    /**
     * Get the full dashboard (all widgets for initial page load).
     */
    public function index(Request $request): JsonResponse
    {
        $widgets = $this->getAuthorizedWidgets($request->user());
        $payload = [];

        foreach ($widgets as $widget) {
            $payload[$widget->key()] = $this->collectWidget($widget);
        }

        return response()->json($payload);
    }

    /**
     * Get a single widget (for polling/refresh without reloading the whole page).
     */
    public function show(string $widgetKey, Request $request): JsonResponse
    {
        $widgets = $this->getAuthorizedWidgets($request->user());

        foreach ($widgets as $widget) {
            if ($widget->key() === $widgetKey) {
                return response()->json([
                    $widget->key() => $this->collectWidget($widget)
                ]);
            }
        }

        return response()->json(['error' => 'Widget not found or unauthorized.'], 404);
    }

    // ── Private ───────────────────────────────────────────────────────────────

    /**
     * @return DashboardWidgetInterface[]
     */
    private function getAuthorizedWidgets($user): array
    {
        // 1. Resolve all tagged widgets from the container
        $widgets = app()->tagged('dashboard.widgets');
        
        $authorized = [];

        foreach ($widgets as $widget) {
            if (!$widget instanceof DashboardWidgetInterface) {
                continue;
            }

            // 2. Filter by RBAC (visibleFor)
            if ($widget->visibleFor($user)) {
                $authorized[] = $widget;
            }
        }

        // 3. Sort by priority (lower = first)
        usort($authorized, function ($a, $b) {
            return $a->priority() <=> $b->priority();
        });

        return $authorized;
    }

    private function collectWidget(DashboardWidgetInterface $widget): array
    {
        $ttl = $widget->cacheTtl();

        if ($ttl <= 0) {
            return $widget->collect();
        }

        return Cache::remember(
            "dashboard:widget:{$widget->key()}",
            $ttl,
            fn () => $widget->collect()
        );
    }
}
