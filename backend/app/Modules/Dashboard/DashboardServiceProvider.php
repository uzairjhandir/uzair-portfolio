<?php

namespace App\Modules\Dashboard;

use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use App\Modules\Dashboard\Widgets\ActivityFeedWidget;
use App\Modules\Dashboard\Widgets\KpiWidget;
use App\Modules\Dashboard\Widgets\ModuleStatusWidget;
use App\Modules\Dashboard\Widgets\QueueMonitorWidget;
use App\Modules\Dashboard\Widgets\SearchHealthWidget;
use App\Modules\Dashboard\Widgets\SeoHealthWidget;
use App\Modules\Dashboard\Widgets\StorageWidget;
use App\Modules\Dashboard\Widgets\SystemHealthWidget;
use Illuminate\Support\ServiceProvider;

/**
 * Dashboard Service Provider
 *
 * Registers the global widget registry as a tagged container collection.
 * Any module can register a widget by tagging it, or by simply appending to this list.
 */
class DashboardServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // ── Register all default widgets ──────────────────────────────────────
        $this->app->singleton(KpiWidget::class);
        $this->app->singleton(SystemHealthWidget::class);
        $this->app->singleton(SearchHealthWidget::class);
        $this->app->singleton(SeoHealthWidget::class);
        $this->app->singleton(QueueMonitorWidget::class);
        $this->app->singleton(ActivityFeedWidget::class);
        $this->app->singleton(StorageWidget::class);
        $this->app->singleton(ModuleStatusWidget::class);

        // ── Tag them for easy retrieval by DashboardController ────────────────
        $this->app->tag([
            KpiWidget::class,
            SystemHealthWidget::class,
            SearchHealthWidget::class,
            SeoHealthWidget::class,
            QueueMonitorWidget::class,
            ActivityFeedWidget::class,
            StorageWidget::class,
            ModuleStatusWidget::class,
        ], 'dashboard.widgets');
    }

    public function boot(): void
    {
        // Any future module can register a widget like this:
        // $this->app->tag(MyCustomWidget::class, 'dashboard.widgets');
    }
}
