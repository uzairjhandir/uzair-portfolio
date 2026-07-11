<?php

namespace App\Interfaces;

use App\Models\Page;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface PageRepositoryInterface
{
    public function search(array $filters, int $perPage = 20): LengthAwarePaginator;
    
    public function getTree(): Collection;
    
    public function findByUuid(string $uuid): ?Page;
    
    public function findBySlug(string $slug): ?Page;
    
    public function create(array $data): Page;
    
    public function update(Page $page, array $data): bool;
    
    public function delete(Page $page): bool;
    
    public function duplicate(Page $page, string $newUuid, string $newSlug, string $newTitle): Page;
}
