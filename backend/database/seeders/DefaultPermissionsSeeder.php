<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Services\PermissionService;

class DefaultPermissionsSeeder extends Seeder
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    public function run(): void
    {
        $this->permissionService->seedDefaults();
    }
}
