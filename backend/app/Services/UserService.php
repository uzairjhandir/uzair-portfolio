<?php

namespace App\Services;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->createUser($data);
        
        $this->refreshUserCache($user);
        // TODO: Fire UserCreated Event
        return $user;
    }

    public function updateProfile(User $user, array $data): User
    {
        // Password updates should go through AuthService changePassword
        if (isset($data['password'])) {
            unset($data['password']);
        }
        
        $this->userRepository->updateUser($user, $data);
        
        $this->refreshUserCache($user);
        // TODO: Fire UserUpdated Event
        return $user->refresh();
    }

    public function updateAvatar(User $user, $file): User
    {
        // Use Spatie MediaLibrary
        // $user->addMedia($file)->toMediaCollection('avatars');
        
        $this->refreshUserCache($user);
        return $user->refresh();
    }

    public function changeStatus(User $user, \App\Enums\UserStatus $status): bool
    {
        $result = $this->userRepository->updateUser($user, ['status' => $status->value]);
        $this->refreshUserCache($user);
        return $result;
    }
    
    public function clearUserCache(User $user): void
    {
        Cache::forget("user_{$user->uuid}");
    }
    
    public function refreshUserCache(User $user): void
    {
        Cache::put("user_{$user->uuid}", $user, now()->addHours(24));
    }
}
