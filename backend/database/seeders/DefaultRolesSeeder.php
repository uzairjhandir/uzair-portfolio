<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Enums\RoleEnum;

class DefaultRolesSeeder extends Seeder
{
    public function run(): void
    {
        $roles = RoleEnum::values();

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }
    }
}
