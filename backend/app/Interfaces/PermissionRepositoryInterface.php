<?php

namespace App\Interfaces;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Collection;

interface PermissionRepositoryInterface
{
    public function all(): Collection;
    
    public function grouped(): array;
    
    public function byModule(string $moduleName): Collection;
    
    public function clearCache(): void;
}
