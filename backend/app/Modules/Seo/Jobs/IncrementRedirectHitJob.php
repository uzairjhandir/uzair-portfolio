<?php

namespace App\Modules\Seo\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

/**
 * Increment Redirect Hit Job
 *
 * Fired by CheckRedirectsMiddleware whenever a redirect is resolved.
 * Increments hit_count and updates last_accessed_at asynchronously
 * so the redirect response is never blocked by a DB write.
 *
 * Uses a direct UPDATE (not Eloquent) for maximum speed.
 */
class IncrementRedirectHitJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;

    public function __construct(
        public readonly int $redirectId
    ) {}

    public function handle(): void
    {
        DB::table('redirects')
            ->where('id', $this->redirectId)
            ->update([
                'hit_count'        => DB::raw('hit_count + 1'),
                'last_accessed_at' => now(),
            ]);
    }
}
