<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Interfaces\SettingRepositoryInterface;
use App\Services\SettingService;
use App\Http\Requests\Settings\BulkUpdateSettingsRequest;
use App\Http\Resources\SettingCategoryResource;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct(
        protected SettingRepositoryInterface $settingRepository,
        protected SettingService $settingService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Setting::class);
        
        $categories = $this->settingRepository->getAllGrouped();

        // Transform into a keyed structure if desired, or return collection
        // Based on user request: { "general": {...}, "seo": {...} }
        $structured = [];
        foreach ($categories as $category) {
            $structured[$category->slug] = new SettingCategoryResource($category);
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings retrieved successfully',
            'data' => $structured,
            'errors' => null,
            'meta' => null
        ]);
    }

    public function public(Request $request): JsonResponse
    {
        $groups = $request->query('group') ? explode(',', $request->query('group')) : [];
        $keys = $request->query('keys') ? explode(',', $request->query('keys')) : [];
        
        $categories = $this->settingRepository->getPublic($groups, $keys);

        $structured = [];
        foreach ($categories as $category) {
            $structured[$category->slug] = new SettingCategoryResource($category);
        }

        return response()->json([
            'success' => true,
            'message' => 'Public settings retrieved successfully',
            'data' => $structured,
            'errors' => null,
            'meta' => null
        ]);
    }

    public function update(BulkUpdateSettingsRequest $request): JsonResponse
    {
        $this->authorize('update', Setting::class);
        
        $this->settingService->bulkUpdate($request->validated('settings'));

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => null,
            'errors' => null,
            'meta' => null
        ]);
    }
}
