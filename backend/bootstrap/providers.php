<?php

use App\Providers\AppServiceProvider;
use App\Providers\AuthServiceProvider;
use App\Providers\RepositoryServiceProvider;
use App\Core\Health\CoreHealthServiceProvider;
use App\Modules\Analytics\AnalyticsServiceProvider;
use App\Modules\Automation\AutomationServiceProvider;
use App\Modules\Dashboard\DashboardServiceProvider;
use App\Modules\DeveloperPortal\DeveloperPortalServiceProvider;
use App\Modules\Notifications\NotificationsServiceProvider;
use App\Modules\Production\ProductionServiceProvider;
use App\Modules\Search\SearchServiceProvider;
use App\Modules\Seo\SeoServiceProvider;
use App\Modules\Settings\Providers\SettingsServiceProvider;
use App\Modules\LiveChat\Providers\LiveChatServiceProvider;

return [
    AppServiceProvider::class,
    AuthServiceProvider::class,
    RepositoryServiceProvider::class,
    CoreHealthServiceProvider::class,
    AnalyticsServiceProvider::class,
    AutomationServiceProvider::class,
    DashboardServiceProvider::class,
    DeveloperPortalServiceProvider::class,
    NotificationsServiceProvider::class,
    ProductionServiceProvider::class,
    SearchServiceProvider::class,
    SeoServiceProvider::class,
    SettingsServiceProvider::class,
    LiveChatServiceProvider::class,
];
