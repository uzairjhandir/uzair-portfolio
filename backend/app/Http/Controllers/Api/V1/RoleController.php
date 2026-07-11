<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Services\RoleService;
use App\Interfaces\RoleRepositoryInterface;
use App\Http\Requests\Roles\CreateRoleRequest;
use App\Http\Requests\Roles\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $roleService,
        protected RoleRepositoryInterface $roleRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Role::class);
        $perPage = $request->query('per_page', 15);
        $roles = $this->roleRepository->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Roles retrieved successfully',
            'data' => RoleResource::collection($roles),
            'errors' => null,
            'meta' => [
                'total' => $roles->total(),
                'per_page' => $roles->perPage(),
                'current_page' => $roles->currentPage(),
                'last_page' => $roles->lastPage(),
            ]
        ]);
    }

    public function show(string $uuid): JsonResponse
    {
        $role = $this->roleRepository->findByUuid($uuid);
        if (!$role) abort(404, 'Role not found');
        $this->authorize('view', $role);

        return response()->json([
            'success' => true,
            'message' => 'Role retrieved successfully',
            'data' => new RoleResource($role->load('permissions')),
            'errors' => null,
            'meta' => null
        ]);
    }

    public function store(CreateRoleRequest $request): JsonResponse
    {
        $this->authorize('create', Role::class);
        
        $data = $request->validated();
        $permissions = $data['permissions'] ?? [];
        unset($data['permissions']);
        
        $role = $this->roleService->createRole($data, $permissions);

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully',
            'data' => new RoleResource($role),
            'errors' => null,
            'meta' => null
        ], 201);
    }

    public function update(UpdateRoleRequest $request, string $uuid): JsonResponse
    {
        $role = $this->roleRepository->findByUuid($uuid);
        if (!$role) abort(404, 'Role not found');
        $this->authorize('update', $role);

        $data = $request->validated();
        $permissions = $data['permissions'] ?? [];
        unset($data['permissions']);

        $role = $this->roleService->updateRole($role, $data, $permissions);

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully',
            'data' => new RoleResource($role),
            'errors' => null,
            'meta' => null
        ]);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $role = $this->roleRepository->findByUuid($uuid);
        if (!$role) abort(404, 'Role not found');
        $this->authorize('delete', $role);

        $this->roleService->deleteRole($role);

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully',
            'data' => null,
            'errors' => null,
            'meta' => null
        ]);
    }
}
