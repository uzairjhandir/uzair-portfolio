<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Interfaces\NavigationRepositoryInterface;
use App\Services\NavigationService;
use App\Http\Requests\Navigation\ReorderNavigationRequest;
use App\Http\Resources\NavigationItemResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NavigationController extends Controller
{
    public function __construct(
        protected NavigationRepositoryInterface $navigationRepository,
        protected NavigationService $navigationService
    ) {}

    // Public Endpoint for Next.js Frontend
    public function index(Request $request): JsonResponse
    {
        $location = $request->query('location');
        if (!$location) {
            abort(400, 'Location query parameter is required');
        }

        $menu = $this->navigationService->getCachedMenuTree($location);
        
        if (!$menu) {
            return response()->json([
                'success' => true,
                'message' => 'Navigation retrieved successfully (empty)',
                'data' => [
                    'name' => ucfirst($location),
                    'items' => [],
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Navigation retrieved successfully',
            'data' => [
                'name' => $menu->name,
                'items' => NavigationItemResource::collection($menu->rootItems),
            ]
        ]);
    }

    // Admin Endpoints
    public function reorder(ReorderNavigationRequest $request, string $uuid): JsonResponse
    {
        $menu = $this->navigationRepository->findMenuByUuid($uuid);
        if (!$menu) {
            abort(404, 'Navigation menu not found');
        }
        
        $this->authorize('update', $menu);

        // Replace uuids with internal DB IDs in the repository layer (simplified here)
        $this->navigationService->reorder($menu->location, $request->validated()['tree']);

        return response()->json([
            'success' => true,
            'message' => 'Navigation reordered successfully',
        ]);
    }

    public function duplicate(string $uuid): JsonResponse
    {
        $menu = $this->navigationRepository->findMenuByUuid($uuid);
        if (!$menu) {
            abort(404, 'Navigation menu not found');
        }
        $this->authorize('create', $menu);

        $replica = $this->navigationRepository->duplicateMenu(
            $menu, 
            \Illuminate\Support\Str::uuid()->toString(),
            $menu->slug . '-copy',
            $menu->name . ' (Copy)'
        );

        return response()->json([
            'success' => true,
            'message' => 'Navigation duplicated successfully',
            'data' => ['uuid' => $replica->uuid]
        ]);
    }
}
