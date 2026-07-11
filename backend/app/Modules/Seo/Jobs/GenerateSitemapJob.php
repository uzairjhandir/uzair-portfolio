<?php

namespace App\Modules\Seo\Jobs;

use App\Modules\Seo\Sitemap\SitemapEngine;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Generate Sitemap Job
 *
 * Dispatched by:
 *   - SeoRoutingListener on ContentPublished / ContentUnpublished / ContentDeleted
 *   - SitemapController::rebuild() (admin manual trigger)
 *   - Module 22 Scheduler (cron: daily full rebuild)
 *
 * Only rebuilds the affected section when $section is provided.
 * Full rebuild ($section = null) regenerates all enabled sources + index.
 */
class GenerateSitemapJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int    $tries   = 3;
    public int    $timeout = 120;

    public function __construct(
        public readonly ?string $section = null, // null = full rebuild
    ) {}

    public function handle(SitemapEngine $engine): void
    {
        $engine->generate($this->section);
    }
}
