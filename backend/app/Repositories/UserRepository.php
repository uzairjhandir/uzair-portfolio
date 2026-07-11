<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
    
    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)->first();
    }
    
    public function findByUuid(string $uuid): ?User
    {
        return User::where('uuid', $uuid)->first();
    }
    
    public function findActive(string $uuid): ?User
    {
        return User::where('uuid', $uuid)
            ->where('status', \App\Enums\UserStatus::ACTIVE)
            ->first();
    }
    
    public function emailExists(string $email): bool
    {
        return User::where('email', $email)->exists();
    }
    
    public function usernameExists(string $username): bool
    {
        return User::where('username', $username)->exists();
    }
    
    public function updateLastLogin(User $user, string $ip): bool
    {
        return $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ]);
    }
    
    public function search(string $term): Collection
    {
        return User::where('name', 'LIKE', "%{$term}%")
            ->orWhere('email', 'LIKE', "%{$term}%")
            ->orWhere('username', 'LIKE', "%{$term}%")
            ->get();
    }
    
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return User::latest()->paginate($perPage);
    }
    
    public function createUser(array $data): User
    {
        return User::create($data);
    }
    
    public function updateUser(User $user, array $data): bool
    {
        return $user->update($data);
    }
    
    public function deleteUser(User $user): bool
    {
        return $user->delete();
    }
    
    public function restoreUser(string $uuid): bool
    {
        $user = User::withTrashed()->where('uuid', $uuid)->first();
        if ($user) {
            return $user->restore();
        }
        return false;
    }
}
