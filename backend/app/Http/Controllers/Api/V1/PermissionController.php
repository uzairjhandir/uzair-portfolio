<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Interfaces\PermissionRepositoryInterface;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionRepositoryInterface $permissionRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Permission::class);
        
        $grouped = $request->query('grouped', false);
        
        if ($grouped) {
            return response()->json([
                'success' => true,
                'message' => 'Grouped permissions retrieved successfully',
                'data' => $this->permissionRepository->grouped(),
                'errors' => null,
                'meta' => null
            ]);
        }

        $permissions = $this->permissionRepository->all();

        return response()->json([
            'success' => true,
            'message' => 'Permissions retrieved successfully',
            'data' => PermissionResource::collection($permissions),
            'errors' => null,
            'meta' => null
        ]);
    }
}
