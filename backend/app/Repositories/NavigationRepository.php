<?php

namespace App\Repositories;

use App\Interfaces\NavigationRepositoryInterface;
use App\Models\NavigationMenu;
use App\Models\NavigationItem;
use Illuminate\Database\Eloquent\Collection;

class NavigationRepository implements NavigationRepositoryInterface
{
    public function getMenuTree(string $location): ?NavigationMenu
    {
        return NavigationMenu::where('location', $location)
            ->where('status', 'published')
            ->with(['rootItems.children' => function ($q) {
                // Preload up to 3 levels deep for tree
                $q->with(['children.children', 'page', 'media']);
            }, 'rootItems.page', 'rootItems.media'])
            ->first();
    }
    
    public function reorder(array $treeData): bool
    {
        // Mass update logic for nesting and sorting
        // $treeData format: [['id' => 1, 'parent_id' => null, 'sort_order' => 0], ...]
        foreach ($treeData as $data) {
            NavigationItem::where('uuid', $data['uuid'])->update([
                'parent_id' => $data['parent_id'] ?? null,
                'sort_order' => $data['sort_order'] ?? 0,
            ]);
        }
        return true;
    }
    
    public function findMenuByUuid(string $uuid): ?NavigationMenu
    {
        return NavigationMenu::where('uuid', $uuid)->first();
    }
    
    public function duplicateMenu(NavigationMenu $menu, string $newUuid, string $newSlug, string $newName): NavigationMenu
    {
        $replica = $menu->replicate();
        $replica->uuid = $newUuid;
        $replica->slug = $newSlug;
        $replica->name = $newName;
        $replica->status = 'draft';
        $replica->save();

        // Recursively clone items (stubbed for brevity)
        return $replica;
    }
}
