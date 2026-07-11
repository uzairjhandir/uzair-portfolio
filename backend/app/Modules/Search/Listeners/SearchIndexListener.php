<?php

namespace App\Modules\Search\Listeners;

use App\Events\ContentPublished;
use App\Events\ContentUpdated;
use App\Events\ContentDeleted;
use App\Modules\Search\Contracts\SearchableResource;
use App\Modules\Search\Jobs\IndexSearchDocumentJob;
use App\Modules\Search\Jobs\RemoveSearchDocumentJob;

/**
 * Search Index Listener
 *
 * Listens to Content lifecycle events and dispatches queue jobs.
 * Never calls the driver directly — keeps the HTTP request cycle fast.
 *
 * Pipeline:
 *   ContentPublished / ContentUpdated → IndexSearchDocumentJob (search queue)
 *   ContentDeleted                    → RemoveSearchDocumentJob (search queue)
 */
class SearchIndexListener
{
    public function handlePublished(ContentPublished $event): void
    {
        if ($event->content instanceof SearchableResource) {
            IndexSearchDocumentJob::dispatch($event->content)->onQueue('search');
        }
    }

    public function handleUpdated(ContentUpdated $event): void
    {
        if ($event->content instanceof SearchableResource) {
            IndexSearchDocumentJob::dispatch($event->content)->onQueue('search');
        }
    }

    public function handleDeleted(ContentDeleted $event): void
    {
        if ($event->content instanceof SearchableResource) {
            RemoveSearchDocumentJob::dispatch($event->content)->onQueue('search');
        }
    }
}
