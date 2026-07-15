<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Enums\UserStatus;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // In production, a fixed, publicly-known password must never be
        // seeded automatically. Require ADMIN_SEED_PASSWORD to be set
        // explicitly (e.g. one-off via `ADMIN_SEED_PASSWORD=... php artisan
        // db:seed --class=AdminSeeder` during initial server setup) instead
        // of silently creating admin@uzair.com / Admin@123456 on every
        // production deploy.
        if (app()->isProduction() && !env('ADMIN_SEED_PASSWORD')) {
            $this->command->warn('Skipped AdminSeeder in production - set ADMIN_SEED_PASSWORD to seed an initial admin explicitly.');
            return;
        }

        $email    = env('ADMIN_SEED_EMAIL', 'admin@uzair.com');
        $password = env('ADMIN_SEED_PASSWORD', 'Admin@123456');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'uuid'     => Str::uuid()->toString(),
                'name'     => 'Uzair Jhandir',
                'password' => bcrypt($password),
                'status'   => UserStatus::ACTIVE,
                'email_verified_at' => now(),
            ]
        );

        // Assign Super Admin role if Spatie Permission is available
        if (method_exists($user, 'assignRole')) {
            // Create role if it doesn't exist
            $roleClass = \Spatie\Permission\Models\Role::class;
            if (class_exists($roleClass)) {
                // roles.uuid is NOT NULL with no default (see migration
                // 0001_01_02_000000_add_uuid_to_roles_and_permissions_table) -
                // Spatie's own Role model has no UUID auto-generation, so it
                // must be set explicitly here or this insert fails on MySQL.
                $role = $roleClass::firstOrCreate(
                    ['name' => 'Super Admin', 'guard_name' => 'sanctum'],
                    ['uuid' => Str::uuid()->toString()]
                );

                // Pass the Role model, not its name: assignRole('Super Admin')
                // resolves the guard via auth.defaults.guard ('web'), not the
                // 'sanctum' guard this role and every API user actually use -
                // passing the model bypasses that name+guard lookup entirely.
                $user->assignRole($role);
            }
        }

        $this->command->info("Admin user created: {$email}");
    }
}
