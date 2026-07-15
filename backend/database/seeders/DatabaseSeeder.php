<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Order matters: DefaultNavigationSeeder attaches an item to the "about"
     * page created by DefaultPagesSeeder, and RolePermissionMatrixSeeder
     * (once implemented) needs roles/permissions to already exist.
     */
    public function run(): void
    {
        $this->call([
            DefaultRolesSeeder::class,
            DefaultPermissionsSeeder::class,
            RolePermissionMatrixSeeder::class,
            AdminSeeder::class,
            MediaFolderSeeder::class,
            DefaultSettingsSeeder::class,
            BlockTypeSeeder::class,
            BlogTaxonomySeeder::class,
            DefaultPagesSeeder::class,
            DefaultNavigationSeeder::class,
        ]);

        // A disposable test account is only useful for local/dev work - never
        // create it in production, where AdminSeeder is the intended way to
        // get a real login.
        if (!app()->isProduction()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }
    }
}
