<?php

namespace App\Repositories;

use App\Interfaces\PermissionRepositoryInterface;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Collection;

class PermissionRepository implements PermissionRepositoryInterface
{
    public function all(): Collection
    {
        return Permission::all();
    }
    
    public function grouped(): array
    {
        $permissions = Permission::all();
        
        $grouped = [];
        foreach ($permissions as $permission) {
            $module = explode('.', $permission->name)[0];
            $grouped[$module][] = $permission;
        }
        
        $result = [];
        foreach ($grouped as $module => $perms) {
            $result[] = [
                'module' => $module,
                'permissions' => \App\Http\Resources\PermissionResource::collection($perms),
            ];
        }
        
        return $result;
    }
    
    public function byModule(string $moduleName): Collection
    {
        return Permission::where('name', 'LIKE', "{$moduleName}.%")->get();
    }
    
    public function clearCache(): void
    {
        // \Spatie\Permission\PermissionRegistrar::class->forgetCachedPermissions();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
