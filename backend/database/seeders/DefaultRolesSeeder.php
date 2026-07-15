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
            // guard_name must be 'sanctum', not the Laravel default 'web' -
            // User::$guard_name (see App\Models\User) and AdminSeeder both
            // assign roles under the 'sanctum' guard; a 'web'-guarded role
            // can never be assigned to a User and throws Spatie's
            // GuardDoesNotMatch on assignRole().
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'sanctum']);
        }
    }
}
