<?php

namespace App\Modules\Search\Listeners;

use App\Events\ContentCreated;
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
 *   ContentCreated (only if already published) / ContentPublished / ContentUpdated → IndexSearchDocumentJob (search queue)
 *   ContentDeleted                                                                  → RemoveSearchDocumentJob (search queue)
 */
class SearchIndexListener
{
    /**
     * Content created directly with status=published (create-and-publish in
     * one step, the common admin flow) never fires ContentPublished — that
     * event is only dispatched by the dedicated publish() action. Without
     * this handler, such content is never indexed until it's later updated.
     */
    public function handleCreated(ContentCreated $event): void
    {
        if ($event->content instanceof SearchableResource
            && ($event->content->status ?? null) === 'published') {
            IndexSearchDocumentJob::dispatch($event->content)->onQueue('search');
        }
    }

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
