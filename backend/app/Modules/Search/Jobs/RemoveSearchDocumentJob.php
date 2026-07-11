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
 * Queue a document removal from the search index.
 *
 * Pipeline:
 *   ContentDeleted
 *     → SearchIndexListener
 *     → RemoveSearchDocumentJob (queue)
 *     → SearchManager
 *     → Driver
 *
 * Soft-deleted content stays in the index until this job processes.
 * For immediate removal requirements, call $search->remove() directly
 * from a synchronous context.
 */
class RemoveSearchDocumentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $backoff = 5;
    public int $timeout = 30;

    public function __construct(
        private readonly SearchableResource $resource
    ) {}

    public function handle(SearchManager $search): void
    {
        $search->remove($this->resource);
    }

    public function failed(Throwable $exception): void
    {
        logger()->error('SearchIndex: remove job failed', [
            'resource_type' => get_class($this->resource),
            'resource_id'   => $this->resource->id ?? null,
            'error'         => $exception->getMessage(),
        ]);
    }
}
