<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('v1')->group(function () {
    
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');
        // Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        // Route::post('reset-password', [AuthController::class, 'resetPassword']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            // Route::post('change-password', [AuthController::class, 'changePassword']);
        });
    });

    // Public Routes
    Route::get('settings/public', [\App\Http\Controllers\Api\V1\SettingController::class, 'public']);

    // Public Content Read Routes — published-only duplicates of the admin
    // (auth-gated) CRUD routes below. Phase 9 finding: every content-module
    // GET route was behind auth:sanctum, so the public Next.js site could
    // never actually read published content (confirmed via curl: GET /blogs
    // returned 401 Unauthenticated with no token). These are additive only —
    // no existing authed route's behavior changed. Status is always
    // hard-forced server-side in the *Controller::publicIndex/publicShow
    // methods, never trusted from a client-supplied query param.
    Route::prefix('public')->group(function () {
        Route::get('pages/{slugOrUuid}/render', [\App\Http\Controllers\Api\V1\PageBuilderController::class, 'publicRender']);

        Route::get('blogs', [\App\Modules\Blog\BlogController::class, 'publicIndex']);
        Route::get('blogs/{slugOrUuid}', [\App\Modules\Blog\BlogController::class, 'publicShow']);

        Route::get('portfolios', [\App\Modules\Portfolio\PortfolioController::class, 'publicIndex']);
        Route::get('portfolios/{slugOrUuid}', [\App\Modules\Portfolio\PortfolioController::class, 'publicShow']);

        Route::get('case-studies', [\App\Modules\CaseStudy\CaseStudyController::class, 'publicIndex']);
        Route::get('case-studies/{slugOrUuid}', [\App\Modules\CaseStudy\CaseStudyController::class, 'publicShow']);

        Route::get('downloads', [\App\Modules\Downloads\DownloadController::class, 'publicIndex']);
        Route::get('downloads/{slugOrUuid}', [\App\Modules\Downloads\DownloadController::class, 'publicShow']);
    });

    // User Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('users', UserController::class)->parameters(['users' => 'uuid']);
        Route::post('users/{uuid}/roles', [\App\Http\Controllers\Api\V1\UserRoleController::class, 'syncRoles']);

        Route::apiResource('roles', \App\Http\Controllers\Api\V1\RoleController::class)->parameters(['roles' => 'uuid']);
        Route::get('permissions', [\App\Http\Controllers\Api\V1\PermissionController::class, 'index']);

        Route::get('settings', [\App\Http\Controllers\Api\V1\SettingController::class, 'index']);
        Route::put('settings', [\App\Http\Controllers\Api\V1\SettingController::class, 'update']);
        Route::post('settings/email/test-connection', [\App\Http\Controllers\Api\V1\SettingController::class, 'testEmailConnection']);
        Route::post('settings/email/test-send',       [\App\Http\Controllers\Api\V1\SettingController::class, 'testEmailSend']);

        // Media Library Routes
        Route::apiResource('media', \App\Http\Controllers\Api\V1\MediaController::class)->parameters(['media' => 'uuid']);
        Route::post('media/{uuid}/replace', [\App\Http\Controllers\Api\V1\MediaController::class, 'replace']);
        Route::put('media/{uuid}/metadata', [\App\Http\Controllers\Api\V1\MediaController::class, 'updateMetadata']);
        Route::post('media/bulk-move', [\App\Http\Controllers\Api\V1\MediaController::class, 'bulkMove']);
        Route::post('media/{uuid}/restore', [\App\Http\Controllers\Api\V1\MediaController::class, 'restore']);
        
        Route::apiResource('media-folders', \App\Http\Controllers\Api\V1\MediaFolderController::class)->parameters(['media_folders' => 'uuid']);
        
        // Pages CMS Routes
        Route::get('pages/tree', [\App\Http\Controllers\Api\V1\PageController::class, 'tree']);
        Route::apiResource('pages', \App\Http\Controllers\Api\V1\PageController::class)->parameters(['pages' => 'uuid']);
        Route::post('pages/{uuid}/publish', [\App\Http\Controllers\Api\V1\PageController::class, 'publish']);
        Route::post('pages/{uuid}/unpublish', [\App\Http\Controllers\Api\V1\PageController::class, 'unpublish']);
        Route::post('pages/{uuid}/duplicate', [\App\Http\Controllers\Api\V1\PageController::class, 'duplicate']);
        
        // Navigation Admin Routes
        Route::post('navigation/{uuid}/reorder', [\App\Http\Controllers\Api\V1\NavigationController::class, 'reorder']);
        Route::post('navigation/{uuid}/duplicate', [\App\Http\Controllers\Api\V1\NavigationController::class, 'duplicate']);
        
        // Block Registry Routes
        Route::get('block-types', [\App\Http\Controllers\Api\V1\BlockTypeController::class, 'index']);
        Route::get('block-types/{uuid}', [\App\Http\Controllers\Api\V1\BlockTypeController::class, 'show']);
        
        Route::post('blocks/preview', [\App\Http\Controllers\Api\V1\BlockController::class, 'preview']);
        Route::apiResource('blocks', \App\Http\Controllers\Api\V1\BlockController::class)->parameters(['blocks' => 'uuid']);
        Route::post('blocks/{uuid}/duplicate', [\App\Http\Controllers\Api\V1\BlockController::class, 'duplicate']);
        
        // Page Builder Routes
        Route::post('pages/{uuid}/builder/sync', [\App\Http\Controllers\Api\V1\PageBuilderController::class, 'sync']);
        Route::post('pages/{uuid}/builder/publish', [\App\Http\Controllers\Api\V1\PageBuilderController::class, 'publish']);
        Route::get('pages/{uuid}/render', [\App\Http\Controllers\Api\V1\PageBuilderController::class, 'render']);

        // Taxonomy Routes (universal — used by Blog, Portfolio, etc.)
        Route::get('taxonomies', [\App\Http\Controllers\Api\V1\TaxonomyController::class, 'index']);
        Route::post('taxonomies', [\App\Http\Controllers\Api\V1\TaxonomyController::class, 'store']);
        Route::get('taxonomies/{uuid}', [\App\Http\Controllers\Api\V1\TaxonomyController::class, 'show']);
        Route::get('taxonomies/{uuid}/terms', [\App\Http\Controllers\Api\V1\TaxonomyController::class, 'terms']);
        Route::post('taxonomies/{uuid}/terms', [\App\Http\Controllers\Api\V1\TaxonomyController::class, 'storeTerm']);

        // ── Module 11: Blog ────────────────────────────────────────────────────
        // Standard CRUD (inherited from AbstractContentController)
        Route::apiResource('blogs', \App\Modules\Blog\BlogController::class)->parameters(['blogs' => 'uuid']);

        // Shared lifecycle actions (inherited)
        Route::post('blogs/{uuid}/publish',   [\App\Modules\Blog\BlogController::class, 'publish']);
        Route::post('blogs/{uuid}/unpublish', [\App\Modules\Blog\BlogController::class, 'unpublish']);
        Route::post('blogs/{uuid}/duplicate', [\App\Modules\Blog\BlogController::class, 'duplicate']);
        Route::post('blogs/{uuid}/restore',   [\App\Modules\Blog\BlogController::class, 'restore']);
        Route::post('blogs/{uuid}/preview',   [\App\Modules\Blog\BlogController::class, 'preview']);
        Route::get('blogs/{uuid}/export',     [\App\Modules\Blog\BlogController::class, 'export']);
        Route::post('blogs/import',           [\App\Modules\Blog\BlogController::class, 'import']);
        Route::post('blogs/{uuid}/heartbeat', [\App\Modules\Blog\BlogController::class, 'heartbeat']);

        // Revision endpoints (inherited)
        Route::get('blogs/{uuid}/revisions',               [\App\Modules\Blog\BlogController::class, 'revisions']);
        Route::get('blogs/{uuid}/revisions/{version}',     [\App\Modules\Blog\BlogController::class, 'showRevision']);
        Route::get('blogs/{uuid}/revisions/diff',          [\App\Modules\Blog\BlogController::class, 'diffRevisions']);

        // Blog-specific endpoints ONLY
        Route::get('blogs/featured',           [\App\Modules\Blog\BlogController::class, 'featured']);
        Route::get('blogs/pinned',             [\App\Modules\Blog\BlogController::class, 'pinned']);
        Route::get('blogs/{uuid}/related',     [\App\Modules\Blog\BlogController::class, 'related']);

        // ── Module 12: Portfolio ───────────────────────────────────────────────
        Route::apiResource('portfolios', \App\Modules\Portfolio\PortfolioController::class)->parameters(['portfolios' => 'uuid']);
        Route::post('portfolios/{uuid}/publish',   [\App\Modules\Portfolio\PortfolioController::class, 'publish']);
        Route::post('portfolios/{uuid}/unpublish', [\App\Modules\Portfolio\PortfolioController::class, 'unpublish']);
        Route::post('portfolios/{uuid}/duplicate', [\App\Modules\Portfolio\PortfolioController::class, 'duplicate']);
        Route::post('portfolios/{uuid}/restore',   [\App\Modules\Portfolio\PortfolioController::class, 'restore']);
        Route::post('portfolios/{uuid}/preview',   [\App\Modules\Portfolio\PortfolioController::class, 'preview']);
        Route::get('portfolios/{uuid}/export',     [\App\Modules\Portfolio\PortfolioController::class, 'export']);
        Route::post('portfolios/{uuid}/heartbeat', [\App\Modules\Portfolio\PortfolioController::class, 'heartbeat']);
        Route::get('portfolios/{uuid}/revisions',          [\App\Modules\Portfolio\PortfolioController::class, 'revisions']);
        Route::get('portfolios/{uuid}/revisions/{version}',[\App\Modules\Portfolio\PortfolioController::class, 'showRevision']);
        Route::get('portfolios/{uuid}/revisions/diff',     [\App\Modules\Portfolio\PortfolioController::class, 'diffRevisions']);
        // Portfolio-specific
        Route::get('portfolios/featured',          [\App\Modules\Portfolio\PortfolioController::class, 'featured']);
        Route::get('portfolios/open-source',       [\App\Modules\Portfolio\PortfolioController::class, 'openSource']);
        Route::post('portfolios/{uuid}/view',      [\App\Modules\Portfolio\PortfolioController::class, 'recordView']);

        // ── Module 13: Case Studies ────────────────────────────────────────────
        Route::apiResource('case-studies', \App\Modules\CaseStudy\CaseStudyController::class)->parameters(['case-studies' => 'uuid']);
        Route::post('case-studies/{uuid}/publish',   [\App\Modules\CaseStudy\CaseStudyController::class, 'publish']);
        Route::post('case-studies/{uuid}/unpublish', [\App\Modules\CaseStudy\CaseStudyController::class, 'unpublish']);
        Route::post('case-studies/{uuid}/duplicate', [\App\Modules\CaseStudy\CaseStudyController::class, 'duplicate']);
        Route::post('case-studies/{uuid}/restore',   [\App\Modules\CaseStudy\CaseStudyController::class, 'restore']);
        Route::post('case-studies/{uuid}/preview',   [\App\Modules\CaseStudy\CaseStudyController::class, 'preview']);
        Route::get('case-studies/{uuid}/export',     [\App\Modules\CaseStudy\CaseStudyController::class, 'export']);
        Route::post('case-studies/{uuid}/heartbeat', [\App\Modules\CaseStudy\CaseStudyController::class, 'heartbeat']);
        Route::get('case-studies/{uuid}/revisions',             [\App\Modules\CaseStudy\CaseStudyController::class, 'revisions']);
        Route::get('case-studies/{uuid}/revisions/{version}',   [\App\Modules\CaseStudy\CaseStudyController::class, 'showRevision']);
        Route::get('case-studies/{uuid}/revisions/diff',        [\App\Modules\CaseStudy\CaseStudyController::class, 'diffRevisions']);
        // Case Study-specific
        Route::get('case-studies/featured',                     [\App\Modules\CaseStudy\CaseStudyController::class, 'featured']);
        Route::get('case-studies/by-portfolio/{portfolioUuid}', [\App\Modules\CaseStudy\CaseStudyController::class, 'byPortfolio']);
    });

    // ── Core: Feed Engine ─────────────────────────────────────────────────────
    // Public — no auth required
    Route::get('feeds',                [\App\Core\Feeds\FeedController::class, 'index']);
    Route::get('feed/{slug}.xml',      [\App\Core\Feeds\FeedController::class, 'serve'])->defaults('format', 'rss');
    Route::get('feed/{slug}.atom',     [\App\Core\Feeds\FeedController::class, 'serve'])->defaults('format', 'atom');
    Route::get('feed/{slug}.json',     [\App\Core\Feeds\FeedController::class, 'serve'])->defaults('format', 'json');

    // ── Module 14: CRM — Public contact form (no auth) ────────────────────────
    Route::post('contact', [\App\Modules\Crm\ContactController::class, 'publicSubmit']);

    // ── Module 14: CRM — Admin routes (auth required) ─────────────────────────
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::get('crm/contacts',                          [\App\Modules\Crm\ContactController::class, 'index']);
        Route::post('crm/contacts',                         [\App\Modules\Crm\ContactController::class, 'store']);
        Route::get('crm/contacts/{uuid}',                   [\App\Modules\Crm\ContactController::class, 'show']);
        Route::put('crm/contacts/{uuid}',                   [\App\Modules\Crm\ContactController::class, 'update']);
        Route::delete('crm/contacts/{uuid}',                [\App\Modules\Crm\ContactController::class, 'destroy']);
        Route::get('crm/contacts/{uuid}/activities',        [\App\Modules\Crm\ContactController::class, 'activities']);
        Route::post('crm/contacts/{uuid}/activities',       [\App\Modules\Crm\ContactController::class, 'addActivity']);
        Route::post('crm/contacts/{uuid}/stage',            [\App\Modules\Crm\ContactController::class, 'moveStage']);
        Route::get('crm/pipeline',                          [\App\Modules\Crm\ContactController::class, 'pipeline']);
    });

    // ── Module 15: Newsletter — Public (no auth) ──────────────────────────────
    Route::post('newsletter/subscribe',           [\App\Modules\Newsletter\NewsletterController::class, 'subscribe']);
    Route::get('newsletter/confirm/{token}',      [\App\Modules\Newsletter\NewsletterController::class, 'confirm']);
    Route::get('newsletter/unsubscribe/{token}',  [\App\Modules\Newsletter\NewsletterController::class, 'unsubscribe']);
    Route::get('newsletter/lists',                [\App\Modules\Newsletter\NewsletterController::class, 'lists']);

    // ── Module 15: Newsletter — Admin (auth required) ─────────────────────────
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::get('admin/newsletter/subscribers',          [\App\Modules\Newsletter\NewsletterController::class, 'subscribers']);
        Route::get('admin/newsletter/subscribers/{uuid}',   [\App\Modules\Newsletter\NewsletterController::class, 'showSubscriber']);
        Route::delete('admin/newsletter/subscribers/{uuid}',[\App\Modules\Newsletter\NewsletterController::class, 'destroySubscriber']);
        Route::get('admin/newsletter/campaigns',            [\App\Modules\Newsletter\NewsletterController::class, 'campaigns']);
        Route::post('admin/newsletter/campaigns',           [\App\Modules\Newsletter\NewsletterController::class, 'storeCampaign']);
        Route::get('admin/newsletter/campaigns/{uuid}',     [\App\Modules\Newsletter\NewsletterController::class, 'showCampaign']);
        Route::put('admin/newsletter/campaigns/{uuid}',     [\App\Modules\Newsletter\NewsletterController::class, 'updateCampaign']);
        Route::delete('admin/newsletter/campaigns/{uuid}',  [\App\Modules\Newsletter\NewsletterController::class, 'destroyCampaign']);
        Route::get('admin/newsletter/lists',                [\App\Modules\Newsletter\NewsletterController::class, 'adminLists']);
        Route::post('admin/newsletter/lists',               [\App\Modules\Newsletter\NewsletterController::class, 'storeList']);
        Route::delete('admin/newsletter/lists/{uuid}',      [\App\Modules\Newsletter\NewsletterController::class, 'destroyList']);
    });

    // ── Module 16: Downloads ──────────────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::apiResource('downloads', \App\Modules\Downloads\DownloadController::class)->parameters(['downloads' => 'uuid']);
        Route::post('downloads/{uuid}/publish',   [\App\Modules\Downloads\DownloadController::class, 'publish']);
        Route::post('downloads/{uuid}/unpublish', [\App\Modules\Downloads\DownloadController::class, 'unpublish']);
        Route::post('downloads/{uuid}/duplicate', [\App\Modules\Downloads\DownloadController::class, 'duplicate']);
        Route::post('downloads/{uuid}/restore',   [\App\Modules\Downloads\DownloadController::class, 'restore']);
        Route::post('downloads/{uuid}/preview',   [\App\Modules\Downloads\DownloadController::class, 'preview']);
        Route::post('downloads/{uuid}/heartbeat', [\App\Modules\Downloads\DownloadController::class, 'heartbeat']);
        Route::get('downloads/{uuid}/revisions',  [\App\Modules\Downloads\DownloadController::class, 'revisions']);
        Route::get('downloads/{uuid}/revisions/diff', [\App\Modules\Downloads\DownloadController::class, 'diffRevisions']);
    });
    // Downloads-specific (mix of auth and public)
    Route::get('downloads/featured',         [\App\Modules\Downloads\DownloadController::class, 'featured']);
    Route::get('downloads/popular',          [\App\Modules\Downloads\DownloadController::class, 'popular']);
    // No auth:sanctum here — DownloadPolicy::download() already enforces access_level
    // (public/authenticated/subscriber/customer/premium/role/permission) per-item,
    // including explicit support for anonymous users on 'public' downloads.
    Route::post('downloads/{uuid}/serve',    [\App\Modules\Downloads\DownloadController::class, 'serve']);
    Route::get('dl/{token}',                 [\App\Modules\Downloads\DownloadController::class, 'resolveToken']); // Public — token IS the credential

    // ── Module 17: Search Engine ──────────────────────────────────────────────
    Route::get('search',          [\App\Modules\Search\SearchController::class, 'search']);
    Route::get('search/suggest',  [\App\Modules\Search\SearchController::class, 'suggest']);
    Route::get('search/related',  [\App\Modules\Search\SearchController::class, 'related']);
    
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::post('search/rebuild',      [\App\Modules\Search\SearchController::class, 'rebuild']);
        Route::delete('search/index',      [\App\Modules\Search\SearchController::class, 'flush']);
        Route::get('admin/search/health',  [\App\Modules\Search\SearchController::class, 'health']);
        Route::get('admin/search/global',  [\App\Modules\Search\SearchController::class, 'adminGlobal']);
    });

    // Public Navigation Endpoint (No auth required)
    Route::get('navigation', [\App\Http\Controllers\Api\V1\NavigationController::class, 'index']);

    // ── Module 18b: SEO Redirects & URL Rewrites (auth required) ──────────────
    // RedirectController/UrlRewriteController were fully built with CRUD but
    // never registered here — CheckRedirectsMiddleware/CheckUrlRewritesMiddleware
    // already run on every request, but admins had no way to manage the data.
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::get('admin/redirects',            [\App\Modules\Seo\Redirects\RedirectController::class, 'index']);
        Route::post('admin/redirects',           [\App\Modules\Seo\Redirects\RedirectController::class, 'store']);
        Route::put('admin/redirects/{uuid}',     [\App\Modules\Seo\Redirects\RedirectController::class, 'update']);
        Route::delete('admin/redirects/{uuid}',  [\App\Modules\Seo\Redirects\RedirectController::class, 'destroy']);
        Route::post('admin/redirects/bulk',      [\App\Modules\Seo\Redirects\RedirectController::class, 'bulk']);

        Route::get('admin/url-rewrites',              [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'index']);
        Route::post('admin/url-rewrites',             [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'store']);
        Route::put('admin/url-rewrites/{uuid}',       [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'update']);
        Route::delete('admin/url-rewrites/{uuid}',    [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'destroy']);
        Route::post('admin/url-rewrites/bulk',        [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'bulk']);
        Route::post('admin/url-rewrites/{uuid}/test', [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'test']);
    });
    // Public — Next.js edge middleware fetches this to cache redirects
    Route::get('redirects/export', [\App\Modules\Seo\Redirects\RedirectController::class, 'export']);

    // ── Module 19: Enterprise Dashboard ───────────────────────────────────────
    Route::middleware(['auth:sanctum'])->prefix('admin/dashboard')->group(function () {
        Route::get('/',          [\App\Modules\Dashboard\DashboardController::class, 'index']);
        Route::get('/{widget}',  [\App\Modules\Dashboard\DashboardController::class, 'show']);
    });

    // ── Module 20: Analytics Engine ───────────────────────────────────────────
    Route::prefix('analytics')->group(function () {
        Route::get('config',     [\App\Modules\Analytics\AnalyticsController::class, 'config']);
        Route::post('event',     [\App\Modules\Analytics\AnalyticsController::class, 'event']);
    });

    // ── Module 21: Notifications Tracking ─────────────────────────────────────
    Route::prefix('n')->group(function () {
        Route::get('open/{uuid}',  [\App\Modules\Notifications\NotificationController::class, 'trackOpen']);
        Route::get('click/{uuid}', [\App\Modules\Notifications\NotificationController::class, 'trackClick']);
    });

    // ── Module 21b: Notifications Admin (auth required) ───────────────────────
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::get('admin/notifications', [\App\Modules\Notifications\NotificationController::class, 'index']);
    });

    // ── Module 22: Automation (auth required) ─────────────────────────────────
    Route::middleware(['auth:sanctum', 'verified'])->prefix('automation')->group(function () {
        Route::get('workflows',                          [\App\Modules\Automation\AutomationController::class, 'index']);
        Route::post('workflows',                         [\App\Modules\Automation\AutomationController::class, 'store']);
        Route::get('workflows/{uuid}',                    [\App\Modules\Automation\AutomationController::class, 'show']);
        Route::put('workflows/{uuid}',                    [\App\Modules\Automation\AutomationController::class, 'update']);
        Route::delete('workflows/{uuid}',                 [\App\Modules\Automation\AutomationController::class, 'destroy']);
        Route::get('workflows/{uuid}/versions',            [\App\Modules\Automation\AutomationController::class, 'versions']);
        Route::post('workflows/{uuid}/versions',           [\App\Modules\Automation\AutomationController::class, 'publishVersion']);
        Route::get('workflows/{uuid}/runs',                [\App\Modules\Automation\AutomationController::class, 'runs']);
        Route::get('runs/{id}',                            [\App\Modules\Automation\AutomationController::class, 'showRun']);
    });

    // ── Module 23: Developer Portal ───────────────────────────────────────────
    Route::prefix('docs')->group(function () {
        Route::get('{version}/openapi.json', [\App\Modules\DeveloperPortal\Controllers\ApiDocsController::class, 'spec']);
        Route::get('{version}/swagger',      [\App\Modules\DeveloperPortal\Controllers\ApiDocsController::class, 'swagger']);
        Route::get('{version}/redoc',        [\App\Modules\DeveloperPortal\Controllers\ApiDocsController::class, 'redoc']);
        Route::get('{version}/postman',      [\App\Modules\DeveloperPortal\Controllers\ApiDocsController::class, 'postman']);
    });

    // ── Module 24: Production Hardening (Health Endpoints) ────────────────────
    // live/ready/startup stay public — load balancer / uptime probes need them
    // unauthenticated, and they reveal nothing beyond an ok/unavailable status.
    Route::prefix('health')->group(function () {
        Route::get('live',    [\App\Modules\Production\Http\Controllers\HealthEndpointController::class, 'live']);
        Route::get('ready',   [\App\Modules\Production\Http\Controllers\HealthEndpointController::class, 'ready']);
        Route::get('startup', [\App\Modules\Production\Http\Controllers\HealthEndpointController::class, 'startup']);
    });
    // 'details' leaks internal infrastructure info (server file paths, DB
    // latency, queue backlog, SEO scores) - was public with only a
    // "Should be protected in prod" comment that was never acted on.
    Route::middleware(['auth:sanctum', 'verified'])->group(function () {
        Route::get('health/details', [\App\Modules\Production\Http\Controllers\HealthEndpointController::class, 'details']);
    });

    // ── Module 26: Live Chat Configuration ────────────────────────────────────
    Route::get('livechat/config', [\App\Modules\LiveChat\Http\Controllers\LiveChatConfigController::class, 'config']);

});
