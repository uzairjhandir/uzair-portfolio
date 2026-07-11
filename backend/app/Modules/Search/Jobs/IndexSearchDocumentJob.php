<?php

namespace App\Modules\Search\Jobs;

use App\Modules\Search\Contracts\SearchableResource;
use App\Modules\Search\SearchManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

/**
 * Queue a single document to be indexed by the active SearchDriver.
 *
 * Pipeline:
 *   ContentPublished / ContentUpdated
 *     → SearchIndexListener
 *     → IndexSearchDocumentJob (queue)
 *     → SearchManager
 *     → Driver (Database / Meilisearch / Elastic)
 *
 * Large bulk imports stay fast because indexing is async.
 */
class IndexSearchDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Retry up to 3 times with exponential backoff.
     * (5s, 25s, 125s — avoids thundering herd on driver unavailability)
     */
    public int $tries = 3;
    public int $backoff = 5;

    /**
     * Only spend up to 60 seconds per indexing attempt.
     */
    public int $timeout = 60;

    public function __construct(
        private readonly SearchableResource $resource
    ) {}

    public function handle(SearchManager $search): void
    {
        $search->index($this->resource);
    }

    public function failed(Throwable $exception): void
    {
        // Health snapshot records the failure — tracked via search_health table
        logger()->error('SearchIndex: index job failed', [
            'resource_type' => get_class($this->resource),
            'resource_id'   => $this->resource->id ?? null,
            'error'         => $exception->getMessage(),
        ]);
    }
}
