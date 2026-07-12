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
                $roleClass::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'sanctum']);
                $user->assignRole('Super Admin');
            }
        }

        $this->command->info("Admin user created: {$email}");
    }
}
