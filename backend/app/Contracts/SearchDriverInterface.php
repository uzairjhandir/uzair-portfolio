<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Model;

/**
 * Swappable search driver. Bind a concrete implementation in AppServiceProvider.
 * Swapping from Database to Meilisearch requires zero changes to Models or Services.
 */
interface SearchDriverInterface
{
    public function index(Model $model): void;

    public function deindex(Model $model): void;

    public function search(string $query, string $contentType = '*', array $filters = []): array;

    public function flush(string $contentType): void;
}
