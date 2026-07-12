<?php

namespace App\Models\Concerns;

/**
 * Indexes/deindexes content by dispatching the same ContentUpdated/
 * ContentDeleted events AbstractContentController already fires.
 * SearchServiceProvider listens for these and routes indexing through
 * the async Search queue — there is no direct driver call to make here.
 */
trait HasContentSearch
{
    public static function bootHasContentSearch(): void
    {
        static::saved(function ($model) {
            if (method_exists($model, 'isPublished') && $model->isPublished()) {
                event(new \App\Events\ContentUpdated($model));
            }
        });

        static::deleted(function ($model) {
            event(new \App\Events\ContentDeleted($model));
        });
    }

    public function reindex(): void
    {
        event(new \App\Events\ContentUpdated($this));
    }

    public function deindex(): void
    {
        event(new \App\Events\ContentDeleted($this));
    }
}
