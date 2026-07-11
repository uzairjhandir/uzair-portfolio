<?php

namespace App\Interfaces;

use App\Models\Role;
use Illuminate\Pagination\LengthAwarePaginator;

interface RoleRepositoryInterface
{
    public function findByUuid(string $uuid): ?Role;
    
    public function findByName(string $name): ?Role;
    
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    
    public function createRole(array $data): Role;
    
    public function updateRole(Role $role, array $data): bool;
    
    public function deleteRole(Role $role): bool;
    
    public function assignPermissions(Role $role, array $permissions): void;
    
    public function syncPermissions(Role $role, array $permissions): void;
    
    // public function restoreRole(string $uuid): bool; // if using soft deletes
}
