<?php

namespace App\Search;

use App\Contracts\SearchDriverInterface;
use App\Models\ContentSearchIndex;
use Illuminate\Database\Eloquent\Model;

/**
 * Default search driver: uses the content_search_index table.
 * Zero external dependencies — works without Redis or Meilisearch.
 */
class DatabaseSearchDriver implements SearchDriverInterface
{
    public function index(Model $model): void
    {
        ContentSearchIndex::updateOrCreate(
            [
                'searchable_type' => $model::class,
                'searchable_id' => $model->id,
            ],
            [
                'title' => $model->title ?? '',
                'body' => $model->excerpt ?? strip_tags($model->content ?? ''),
                'tags' => method_exists($model, 'getTags') ? json_encode($model->getTags()) : null,
                'is_indexed' => true,
                'indexed_at' => now(),
            ]
        );
    }

    public function deindex(Model $model): void
    {
        ContentSearchIndex::where('searchable_type', $model::class)
            ->where('searchable_id', $model->id)
            ->delete();
    }

    public function search(string $query, string $contentType = '*', array $filters = []): array
    {
        $q = ContentSearchIndex::where(function ($q) use ($query) {
            $q->where('title', 'like', "%{$query}%")
              ->orWhere('body', 'like', "%{$query}%");
        });

        if ($contentType !== '*') {
            $q->where('searchable_type', 'like', "%{$contentType}%");
        }

        return $q->get()->toArray();
    }

    public function flush(string $contentType): void
    {
        ContentSearchIndex::where('searchable_type', 'like', "%{$contentType}%")->delete();
    }
}
