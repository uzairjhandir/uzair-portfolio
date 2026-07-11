<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Services\AuthService;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->validated(), 
            $request->ip(), 
            $request->userAgent() ?? ''
        );

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => new UserResource($result['user']),
                'permissions' => [], // To be populated in Module 3
                'roles' => [],       // To be populated in Module 3
                'token' => $result['token'],
                'expires_at' => $result['expires_at'],
            ],
            'errors' => null,
            'meta' => null
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out',
            'data' => null,
            'errors' => null,
            'meta' => null
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Current user retrieved',
            'data' => new UserResource($request->user()),
            'errors' => null,
            'meta' => null
        ]);
    }
}
