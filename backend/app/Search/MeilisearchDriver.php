<?php

namespace App\Search;

use App\Contracts\SearchDriverInterface;
use Illuminate\Database\Eloquent\Model;

/**
 * Meilisearch driver stub.
 * Replace method bodies with meilisearch-laravel calls when ready.
 * Zero changes required in Models, Services, or Controllers.
 */
class MeilisearchDriver implements SearchDriverInterface
{
    public function index(Model $model): void
    {
        // $model->searchable(); // Laravel Scout
    }

    public function deindex(Model $model): void
    {
        // $model->unsearchable();
    }

    public function search(string $query, string $contentType = '*', array $filters = []): array
    {
        // return Model::search($query)->get()->toArray();
        return [];
    }

    public function flush(string $contentType): void
    {
        // Model::removeAllFromSearch();
    }
}
