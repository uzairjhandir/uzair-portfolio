<?php

namespace App\Services;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Enums\UserStatus;

class AuthService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function login(array $credentials, string $ip, string $userAgent): array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== UserStatus::ACTIVE) {
            throw ValidationException::withMessages([
                'email' => ['Your account is currently ' . $user->status->value . '.'],
            ]);
        }

        $this->userRepository->updateLastLogin($user, $ip);

        // TODO: Fire UserLoggedIn event here
        
        $token = $user->createToken('auth_token', ['*'])->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'expires_at' => null, // Sanctum token default no expiration, can be configured
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
        // TODO: Fire UserLoggedOut event
    }

    public function logoutAllDevices(User $user): void
    {
        $user->tokens()->delete();
        // TODO: Fire UserLoggedOut event for all
    }
    
    public function forgotPassword(string $email): bool
    {
        // Implementation stub for sending password reset link
        return true;
    }
    
    public function resetPassword(string $email, string $token, string $password): bool
    {
        // Implementation stub for validating token and resetting
        return true;
    }
    
    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Incorrect current password.']
            ]);
        }
        
        $this->userRepository->updateUser($user, ['password' => Hash::make($newPassword)]);
        return true;
    }
    
    public function verifyEmail(User $user): bool
    {
        if ($user->hasVerifiedEmail()) return false;
        
        $user->markEmailAsVerified();
        return true;
    }
}
