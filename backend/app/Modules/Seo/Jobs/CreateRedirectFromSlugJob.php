<?php

namespace App\Modules\Seo\Jobs;

use App\Modules\Seo\Redirects\Redirect;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

/**
 * Create Redirect From Slug Job
 *
 * Dispatched by HasContentSlug::bootHasContentSlug() whenever a slug changes.
 *
 * Flow:
 *   Content slug changes
 *       ↓
 *   HasContentSlug records old slug in content_slug_history
 *       ↓
 *   Dispatches this job
 *       ↓
 *   Creates a 301 redirect: /old-prefix/old-slug → canonical URL of model
 *       ↓
 *   Clears redirect cache
 *
 * Auto-redirects are marked is_auto = true so admins can distinguish them
 * from manually configured redirects in the UI.
 *
 * Idempotent: uses updateOrInsert on source_path to prevent duplicate redirects
 * if the same slug appears multiple times in history.
 */
class CreateRedirectFromSlugJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(
        public readonly string $oldSlug,
        public readonly string $sourcePath,  // e.g. /blog/old-slug
        public readonly string $targetPath,  // canonical URL of the new content
    ) {}

    public function handle(): void
    {
        // Do not create a redirect if source = target (no-op slug update)
        if ($this->sourcePath === $this->targetPath) {
            return;
        }

        // Avoid redirect chain: if old slug already redirects somewhere, update the target
        \Illuminate\Support\Facades\DB::table('redirects')->updateOrInsert(
            ['source_path' => $this->sourcePath, 'match_type' => 'exact'],
            [
                'uuid'        => \Illuminate\Support\Str::uuid(),
                'target_path' => $this->targetPath,
                'http_code'   => 301,
                'match_type'  => 'exact',
                'is_active'   => true,
                'is_auto'     => true,
                'updated_at'  => now(),
                'created_at'  => now(),
            ]
        );

        // Invalidate cache
        Cache::forget('seo:redirects:active');
        Cache::forget('seo:redirects:export');
    }
}
