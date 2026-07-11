<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Enums\RoleEnum;

class RolePermissionMatrixSeeder extends Seeder
{
    public function run(): void
    {
        // $adminRole = Role::where('name', RoleEnum::ADMIN->value)->first();
        // $adminRole->givePermissionTo(Permission::all());

        // $editorRole = Role::where('name', RoleEnum::EDITOR->value)->first();
        // $editorRole->givePermissionTo([
        //    'blog.view', 'blog.create', 'blog.update', 'blog.publish'
        // ]);
    }
}
