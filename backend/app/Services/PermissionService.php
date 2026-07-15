<?php

namespace App\Services;

use App\Interfaces\PermissionRepositoryInterface;
use App\Enums\PermissionEnum;
use App\Models\Permission;

class PermissionService
{
    public function __construct(
        protected PermissionRepositoryInterface $permissionRepository
    ) {}

    public function seedDefaults(): void
    {
        $permissions = PermissionEnum::values();
        
        foreach ($permissions as $permissionName) {
            // guard_name must be 'sanctum' to match User::$guard_name and the
            // roles seeded by DefaultRolesSeeder - a 'web'-guarded permission
            // can never be given to a 'sanctum'-guarded role.
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'sanctum']);
        }
        
        $this->refreshCache();
    }
    
    public function refreshCache(): void
    {
        $this->permissionRepository->clearCache();
    }
    
    public function getGroupedPermissions(): array
    {
        return $this->permissionRepository->grouped();
    }
}
