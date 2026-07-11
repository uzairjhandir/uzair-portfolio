<?php

namespace App\Interfaces;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;
    
    public function findByUsername(string $username): ?User;
    
    public function findByUuid(string $uuid): ?User;
    
    public function findActive(string $uuid): ?User;
    
    public function emailExists(string $email): bool;
    
    public function usernameExists(string $username): bool;
    
    public function updateLastLogin(User $user, string $ip): bool;
    
    public function search(string $term): Collection;
    
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    
    public function createUser(array $data): User;
    
    public function updateUser(User $user, array $data): bool;
    
    public function deleteUser(User $user): bool;
    
    public function restoreUser(string $uuid): bool;
}
