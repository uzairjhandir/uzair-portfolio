<?php

namespace App\Modules\Seo\Jobs;

use App\Modules\Seo\Health\SeoHealthChecker;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

/**
 * Run SEO Audit Job
 *
 * Runs SeoHealthChecker::check() against all content items of a given type,
 * or all types if $type is null.
 *
 * Dispatched by:
 *   - SeoHealthController::audit() (manual admin trigger)
 *   - Module 22 Scheduler (cron: weekly full audit)
 *
 * Results are persisted to seo_metadata.seo_score after each item.
 * The Module 19 Dashboard SEO widget reads from seo_metadata (no re-compute needed).
 *
 * Uses chunk() to avoid memory exhaustion on large datasets.
 */
class RunSeoAuditJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 1;
    public int $timeout = 600; // 10 minutes max for full audit

    private array $modelMap = [
        'blog'       => \App\Modules\Blog\Blog::class,
        'page'       => \App\Modules\Pages\Page::class,
        'portfolio'  => \App\Modules\Portfolio\Portfolio::class,
        'case_study' => \App\Modules\CaseStudy\CaseStudy::class,
        'download'   => \App\Modules\Downloads\Download::class,
    ];

    public function __construct(
        public readonly ?string $type = null // null = audit all types
    ) {}

    public function handle(SeoHealthChecker $checker): void
    {
        $types = $this->type
            ? [$this->type => $this->modelMap[$this->type] ?? null]
            : $this->modelMap;

        foreach ($types as $typeName => $class) {
            if (!$class || !class_exists($class)) {
                continue;
            }

            $class::where('status', 'published')
                ->chunk(100, function ($items) use ($checker) {
                    foreach ($items as $item) {
                        try {
                            $checker->check($item);
                        } catch (\Throwable $e) {
                            // Never let one failing item abort the entire audit
                            \Illuminate\Support\Facades\Log::warning("SEO audit failed for {$item->uuid}: {$e->getMessage()}");
                        }
                    }
                });
        }
    }
}
