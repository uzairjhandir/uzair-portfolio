<?php

namespace App\Repositories;

use App\Interfaces\RoleRepositoryInterface;
use App\Models\Role;
use Illuminate\Pagination\LengthAwarePaginator;

class RoleRepository implements RoleRepositoryInterface
{
    public function findByUuid(string $uuid): ?Role
    {
        return Role::where('uuid', $uuid)->first();
    }
    
    public function findByName(string $name): ?Role
    {
        return Role::where('name', $name)->first();
    }
    
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Role::with('permissions')->paginate($perPage);
    }
    
    public function createRole(array $data): Role
    {
        return Role::create($data);
    }
    
    public function updateRole(Role $role, array $data): bool
    {
        return $role->update($data);
    }
    
    public function deleteRole(Role $role): bool
    {
        return $role->delete();
    }
    
    public function assignPermissions(Role $role, array $permissions): void
    {
        // Spatie method
        // $role->givePermissionTo($permissions);
    }
    
    public function syncPermissions(Role $role, array $permissions): void
    {
        // Spatie method
        // $role->syncPermissions($permissions);
    }
}
