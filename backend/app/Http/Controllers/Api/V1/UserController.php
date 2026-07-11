<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Services\UserService;
use App\Interfaces\UserRepositoryInterface;
use App\Http\Requests\Users\CreateUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService,
        protected UserRepositoryInterface $userRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);
        $perPage = $request->query('per_page', 15);
        
        $users = $request->has('search') 
            ? $this->userRepository->search($request->query('search'))
            : $this->userRepository->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully',
            'data' => UserResource::collection($users),
            'errors' => null,
            'meta' => method_exists($users, 'total') ? [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ] : null
        ]);
    }

    public function show(string $uuid): JsonResponse
    {
        $user = $this->userRepository->findByUuid($uuid);
        if (!$user) abort(404, 'User not found');
        $this->authorize('view', $user);

        return response()->json([
            'success' => true,
            'message' => 'User retrieved successfully',
            'data' => new UserResource($user),
            'errors' => null,
            'meta' => null
        ]);
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);
        $user = $this->userService->createUser($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => new UserResource($user),
            'errors' => null,
            'meta' => null
        ], 201);
    }

    public function update(UpdateUserRequest $request, string $uuid): JsonResponse
    {
        $user = $this->userRepository->findByUuid($uuid);
        if (!$user) abort(404, 'User not found');
        $this->authorize('update', $user);

        $user = $this->userService->updateProfile($user, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => new UserResource($user),
            'errors' => null,
            'meta' => null
        ]);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $user = $this->userRepository->findByUuid($uuid);
        if (!$user) abort(404, 'User not found');
        $this->authorize('delete', $user);

        $this->userRepository->deleteUser($user);

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
            'data' => null,
            'errors' => null,
            'meta' => null
        ]);
    }
}
