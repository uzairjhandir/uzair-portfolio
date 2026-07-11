<?php

namespace App\Interfaces;

use App\Models\Block;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface BlockRepositoryInterface
{
    public function search(array $filters, int $perPage = 20): LengthAwarePaginator;
    
    public function getGlobals(): Collection;
    
    public function findByUuid(string $uuid): ?Block;
    
    public function resolveMany(array $uuids): Collection;
    
    public function create(array $data): Block;
    
    public function update(Block $block, array $data): bool;
    
    public function delete(Block $block): bool;
    
    public function duplicate(Block $block, string $newUuid): Block;
}
