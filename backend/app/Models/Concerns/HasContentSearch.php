<?php

namespace App\Models\Concerns;

use App\Contracts\SearchDriverInterface;

/**
 * Automatically indexes/deindexes content when published or archived.
 */
trait HasContentSearch
{
    public static function bootHasContentSearch(): void
    {
        static::saved(function ($model) {
            if ($model->isPublished()) {
                app(SearchDriverInterface::class)->index($model);
            }
        });

        static::deleted(function ($model) {
            app(SearchDriverInterface::class)->deindex($model);
        });
    }

    public function reindex(): void
    {
        app(SearchDriverInterface::class)->index($this);
    }

    public function deindex(): void
    {
        app(SearchDriverInterface::class)->deindex($this);
    }
}
