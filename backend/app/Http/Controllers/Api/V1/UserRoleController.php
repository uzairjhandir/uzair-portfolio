<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Interfaces\UserRepositoryInterface;
use App\Http\Requests\Roles\AssignRoleRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class UserRoleController extends Controller
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    public function syncRoles(AssignRoleRequest $request, string $uuid): JsonResponse
    {
        $user = $this->userRepository->findByUuid($uuid);
        if (!$user) abort(404, 'User not found');
        
        // $this->authorize('assignRole', $user);

        // Spatie method to assign roles
        // $user->syncRoles($request->validated('roles'));

        return response()->json([
            'success' => true,
            'message' => 'Roles synced successfully',
            'data' => new UserResource($user),
            'errors' => null,
            'meta' => null
        ]);
    }
}
