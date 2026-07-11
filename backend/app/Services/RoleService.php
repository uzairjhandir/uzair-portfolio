<?php

namespace App\Services;

use App\Interfaces\RoleRepositoryInterface;
use App\Interfaces\PermissionRepositoryInterface;
use App\Models\Role;

class RoleService
{
    public function __construct(
        protected RoleRepositoryInterface $roleRepository,
        protected PermissionRepositoryInterface $permissionRepository
    ) {}

    public function createRole(array $data, array $permissions = []): Role
    {
        $role = $this->roleRepository->createRole($data);
        
        if (!empty($permissions)) {
            $this->roleRepository->syncPermissions($role, $permissions);
        }
        
        $this->permissionRepository->clearCache();
        // TODO: Fire RoleCreated Event
        return $role->load('permissions');
    }

    public function updateRole(Role $role, array $data, array $permissions = []): Role
    {
        $this->roleRepository->updateRole($role, $data);
        
        if (!empty($permissions)) {
            $this->roleRepository->syncPermissions($role, $permissions);
        }
        
        $this->permissionRepository->clearCache();
        // TODO: Fire RoleUpdated Event
        return $role->refresh()->load('permissions');
    }

    public function deleteRole(Role $role): bool
    {
        $result = $this->roleRepository->deleteRole($role);
        $this->permissionRepository->clearCache();
        // TODO: Fire RoleDeleted Event
        return $result;
    }
}
