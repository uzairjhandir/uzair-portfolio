<?php

namespace App\Interfaces;

use App\Models\NavigationMenu;
use Illuminate\Database\Eloquent\Collection;

interface NavigationRepositoryInterface
{
    public function getMenuTree(string $location): ?NavigationMenu;
    
    public function reorder(array $treeData): bool;
    
    public function findMenuByUuid(string $uuid): ?NavigationMenu;
    
    public function duplicateMenu(NavigationMenu $menu, string $newUuid, string $newSlug, string $newName): NavigationMenu;
}
