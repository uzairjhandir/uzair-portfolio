<?php

namespace App\Repositories;

use App\Interfaces\PageRepositoryInterface;
use App\Models\Page;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PageRepository implements PageRepositoryInterface
{
    public function search(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        $query = Page::query()->with(['author', 'featuredImage']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('slug', 'LIKE', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['trashed']) && $filters['trashed']) {
            $query->onlyTrashed();
        }

        return $query->orderBy('sort_order')->latest()->paginate($perPage);
    }
    
    public function getTree(): Collection
    {
        return Page::whereNull('parent_id')
            ->with('children')
            ->orderBy('sort_order')
            ->get();
    }
    
    public function findByUuid(string $uuid): ?Page
    {
        return Page::withTrashed()
            ->with(['author', 'reviewer', 'publisher', 'featuredImage', 'banner', 'ogImage'])
            ->where('uuid', $uuid)
            ->first();
    }
    
    public function findBySlug(string $slug): ?Page
    {
        return Page::where('slug', $slug)
            ->where('status', 'published')
            ->first();
    }
    
    public function create(array $data): Page
    {
        return Page::create($data);
    }
    
    public function update(Page $page, array $data): bool
    {
        return $page->update($data);
    }
    
    public function delete(Page $page): bool
    {
        return $page->delete();
    }
    
    public function duplicate(Page $page, string $newUuid, string $newSlug, string $newTitle): Page
    {
        $replica = $page->replicate();
        $replica->uuid = $newUuid;
        $replica->slug = $newSlug;
        $replica->title = $newTitle;
        $replica->status = 'draft';
        $replica->save();
        
        return $replica;
    }
}
