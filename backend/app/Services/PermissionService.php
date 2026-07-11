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
            Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
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
