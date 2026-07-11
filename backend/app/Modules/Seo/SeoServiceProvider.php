<?php

namespace App\Modules\Seo;

use App\Core\Health\HealthCheckManager;
use App\Events\ContentArchived;
use App\Events\ContentPublished;
use App\Modules\Seo\Canonical\CanonicalService;
use App\Modules\Seo\Health\SeoHealthCheck;
use App\Modules\Seo\Health\SeoHealthChecker;
use App\Modules\Seo\Listeners\SeoRoutingListener;
use App\Modules\Seo\Redirects\CheckRedirectsMiddleware;
use App\Modules\Seo\Schema\SchemaBuilder;
use App\Modules\Seo\Schema\Types\ArticleSchema;
use App\Modules\Seo\Schema\Types\BreadcrumbSchema;
use App\Modules\Seo\Schema\Types\DigitalDocumentSchema;
use App\Modules\Seo\Schema\Types\FAQPageSchema;
use App\Modules\Seo\Schema\Types\OrganizationSchema;
use App\Modules\Seo\Schema\Types\PersonSchema;
use App\Modules\Seo\Schema\Types\ProjectSchema;
use App\Modules\Seo\Sitemap\SitemapEngine;
use App\Modules\Seo\Sitemap\Sources\AuthorSitemapSource;
use App\Modules\Seo\Sitemap\Sources\BlogSitemapSource;
use App\Modules\Seo\Sitemap\Sources\CaseStudySitemapSource;
use App\Modules\Seo\Sitemap\Sources\DownloadsSitemapSource;
use App\Modules\Seo\Sitemap\Sources\PagesSitemapSource;
use App\Modules\Seo\Sitemap\Sources\PortfolioSitemapSource;
use App\Modules\Seo\Sitemap\Sources\TaxonomySitemapSource;
use App\Modules\Seo\UrlRewrites\CheckUrlRewritesMiddleware;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * SEO Service Provider
 *
 * Registers:
 *   1. Singletons: SitemapEngine, CanonicalService, SchemaBuilder, SeoHealthChecker
 *   2. Sitemap sources (ordered: pages first — highest priority)
 *   3. Schema types (detection order matters: most specific first)
 *   4. Middleware: CheckUrlRewritesMiddleware (before router), CheckRedirectsMiddleware (after 404)
 *   5. Event listeners for sitemap regeneration
 *   6. Routes for robots.txt, sitemaps, redirects, SEO health
 *
 * Extensibility:
 *   To add a new sitemap source:
 *     $engine->registerSource(new MySource());  ← in boot()
 *
 *   To add a new schema type:
 *     $builder->register(new ProductSchema());  ← in boot()
 */
class SeoServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // ── Singletons ─────────────────────────────────────────────────────────
        $this->app->singleton(SitemapEngine::class);
        $this->app->singleton(CanonicalService::class);
        $this->app->singleton(SeoHealthChecker::class);

        $this->app->singleton(SchemaBuilder::class, function () {
            $builder = new SchemaBuilder();

            // Register schema types — ORDER MATTERS (first match wins).
            // More specific types should come before general ones.
            $builder->register(new FAQPageSchema());          // Before Article (auto-detects FAQ blocks)
            $builder->register(new ArticleSchema());          // Blog, CaseStudy
            $builder->register(new ProjectSchema());          // Portfolio
            $builder->register(new DigitalDocumentSchema());  // Downloads
            $builder->register(new PersonSchema());           // Pages with schema_type = Person
            $builder->register(new OrganizationSchema());     // Pages with schema_type = Organization

            return $builder;
        });
    }

    public function boot(): void
    {
        // ── Sitemap Sources ────────────────────────────────────────────────────
        $engine = $this->app->make(SitemapEngine::class);

        $engine->registerSource(new PagesSitemapSource());
        $engine->registerSource(new BlogSitemapSource());
        $engine->registerSource(new PortfolioSitemapSource());
        $engine->registerSource(new CaseStudySitemapSource());
        $engine->registerSource(new DownloadsSitemapSource());
        $engine->registerSource(new TaxonomySitemapSource());
        $engine->registerSource(new AuthorSitemapSource()); // disabled by default (config flag)

        // ── Middleware ─────────────────────────────────────────────────────────
        // URL Rewrites run BEFORE routing (transparent server-side path rewrite)
        $this->app['router']->prependMiddlewareToGroup('web', CheckUrlRewritesMiddleware::class);
        $this->app['router']->prependMiddlewareToGroup('api', CheckUrlRewritesMiddleware::class);

        // Redirect resolution runs AFTER routing (only fires on 404 responses)
        $this->app['router']->pushMiddlewareToGroup('web', CheckRedirectsMiddleware::class);
        $this->app['router']->pushMiddlewareToGroup('api', CheckRedirectsMiddleware::class);

        // ── Register SEO Health Check ─────────────────────────────────────────────
        $this->app->make(HealthCheckManager::class)
            ->register(new SeoHealthCheck($this->app->make(SeoHealthChecker::class)));

        // ── Events ─────────────────────────────────────────────────────────────
        Event::listen(ContentPublished::class, [SeoRoutingListener::class, 'handlePublished']);
        Event::listen(ContentArchived::class,  [SeoRoutingListener::class, 'handleArchived']);

        // ── Routes ─────────────────────────────────────────────────────────────
        $this->loadRoutes();
    }

    private function loadRoutes(): void
    {
        Route::prefix('v1')->group(function () {
            $this->registerPublicRoutes();
            $this->registerAdminRoutes();
        });
    }

    private function registerPublicRoutes(): void
    {
        // robots.txt (must be at root — registered outside /v1 prefix)
        Route::get('/robots.txt', [\App\Modules\Seo\Robots\RobotsController::class, 'serve']);

        // Sitemaps
        Route::get('/sitemap.xml',         [\App\Modules\Seo\Sitemap\SitemapController::class, 'index']);
        Route::get('/sitemap-index.xml',   [\App\Modules\Seo\Sitemap\SitemapController::class, 'sitemapIndex']);
        Route::get('/sitemap-{section}.xml', [\App\Modules\Seo\Sitemap\SitemapController::class, 'section'])
            ->where('section', '[a-z0-9\-]+');

        // Redirects export for Next.js edge middleware
        Route::get('redirects/export', [\App\Modules\Seo\Redirects\RedirectController::class, 'export']);
    }

    private function registerAdminRoutes(): void
    {
        Route::middleware(['auth:sanctum'])->group(function () {
            // ── Redirects CRUD ────────────────────────────────────────────────
            Route::get('admin/redirects',              [\App\Modules\Seo\Redirects\RedirectController::class, 'index']);
            Route::post('admin/redirects',             [\App\Modules\Seo\Redirects\RedirectController::class, 'store']);
            Route::put('admin/redirects/{uuid}',       [\App\Modules\Seo\Redirects\RedirectController::class, 'update']);
            Route::delete('admin/redirects/{uuid}',    [\App\Modules\Seo\Redirects\RedirectController::class, 'destroy']);
            Route::post('admin/redirects/bulk',        [\App\Modules\Seo\Redirects\RedirectController::class, 'bulk']);

            // ── URL Rewrites CRUD ─────────────────────────────────────────────
            Route::get('admin/url-rewrites',                [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'index']);
            Route::post('admin/url-rewrites',               [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'store']);
            Route::put('admin/url-rewrites/{uuid}',         [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'update']);
            Route::delete('admin/url-rewrites/{uuid}',      [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'destroy']);
            Route::post('admin/url-rewrites/bulk',          [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'bulk']);
            Route::post('admin/url-rewrites/{uuid}/test',   [\App\Modules\Seo\UrlRewrites\UrlRewriteController::class, 'test']);

            // ── Sitemap ───────────────────────────────────────────────────────
            Route::post('admin/seo/sitemap/rebuild', [\App\Modules\Seo\Sitemap\SitemapController::class, 'rebuild']);

            // ── SEO Health ────────────────────────────────────────────────────
            Route::get('admin/seo/health/overview',         [\App\Modules\Seo\Health\SeoHealthController::class, 'overview']);
            Route::get('admin/seo/health/low-scores',       [\App\Modules\Seo\Health\SeoHealthController::class, 'lowScores']);
            Route::get('admin/seo/health/{type}/{uuid}',    [\App\Modules\Seo\Health\SeoHealthController::class, 'check']);
            Route::post('admin/seo/health/audit',           [\App\Modules\Seo\Health\SeoHealthController::class, 'audit']);
        });
    }
}
