<?php

namespace App\Repositories;

use App\Interfaces\BlockRepositoryInterface;
use App\Models\Block;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BlockRepository implements BlockRepositoryInterface
{
    public function search(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        $query = Block::query()->with(['type', 'children']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('search_content', 'LIKE', "%{$search}%");
            });
        }

        if (isset($filters['is_global'])) {
            $query->where('is_global', $filters['is_global']);
        }
        
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (!empty($filters['category'])) {
            $query->whereHas('type', function($q) use ($filters) {
                $q->where('category', $filters['category']);
            });
        }

        return $query->latest()->paginate($perPage);
    }
    
    public function getGlobals(): Collection
    {
        return Block::where('is_global', true)
            ->with(['type', 'children'])
            ->get();
    }
    
    public function findByUuid(string $uuid): ?Block
    {
        return Block::with(['type', 'children', 'revisions'])
            ->where('uuid', $uuid)
            ->first();
    }
    
    public function resolveMany(array $uuids): Collection
    {
        return Block::whereIn('uuid', $uuids)
            ->with(['type', 'children'])
            ->get()
            ->sortBy(function($block) use ($uuids) {
                return array_search($block->uuid, $uuids);
            })->values();
    }
    
    public function create(array $data): Block
    {
        return Block::create($data);
    }
    
    public function update(Block $block, array $data): bool
    {
        return $block->update($data);
    }
    
    public function delete(Block $block): bool
    {
        return $block->delete();
    }
    
    public function duplicate(Block $block, string $newUuid): Block
    {
        $replica = $block->replicate();
        $replica->uuid = $newUuid;
        $replica->status = 'draft';
        if ($replica->is_global && $replica->name) {
            $replica->name = $replica->name . ' (Copy)';
        }
        $replica->save();
        
        // Recursively clone children if nested blocks exist
        foreach ($block->children as $child) {
            $this->duplicateChild($child, $replica->id);
        }
        
        return $replica;
    }
    
    private function duplicateChild(Block $child, int $newParentId): void
    {
        $replica = $child->replicate();
        $replica->uuid = \Illuminate\Support\Str::uuid()->toString();
        $replica->parent_block_id = $newParentId;
        $replica->save();
        
        foreach ($child->children as $grandchild) {
            $this->duplicateChild($grandchild, $replica->id);
        }
    }
}
