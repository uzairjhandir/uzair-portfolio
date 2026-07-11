<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Interfaces\PageRepositoryInterface;
use App\Services\PageService;
use App\Http\Requests\Pages\CreatePageRequest;
use App\Http\Requests\Pages\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function __construct(
        protected PageRepositoryInterface $pageRepository,
        protected PageService $pageService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Page::class);
        $filters = $request->only(['search', 'status', 'type', 'trashed']);
        
        $pages = $this->pageRepository->search($filters, $request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'message' => 'Pages retrieved successfully',
            'data' => PageResource::collection($pages),
            'meta' => [
                'total' => $pages->total(),
                'per_page' => $pages->perPage(),
                'current_page' => $pages->currentPage(),
                'last_page' => $pages->lastPage(),
            ]
        ]);
    }
    
    public function tree(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Page::class);
        $tree = $this->pageRepository->getTree();
        
        return response()->json([
            'success' => true,
            'message' => 'Page tree retrieved successfully',
            'data' => PageResource::collection($tree),
        ]);
    }

    public function store(CreatePageRequest $request): JsonResponse
    {
        $this->authorize('create', Page::class);

        $page = $this->pageService->createPage($request->validated(), auth()->id());

        return response()->json([
            'success' => true,
            'message' => 'Page created successfully',
            'data' => new PageResource($page),
        ], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $page = $this->pageRepository->findByUuid($uuid);
        if (!$page) abort(404, 'Page not found');
        $this->authorize('view', $page);

        return response()->json([
            'success' => true,
            'message' => 'Page retrieved successfully',
            'data' => new PageResource($page),
        ]);
    }

    public function update(UpdatePageRequest $request, string $uuid): JsonResponse
    {
        $page = $this->pageRepository->findByUuid($uuid);
        if (!$page) abort(404, 'Page not found');
        $this->authorize('update', $page);

        $page = $this->pageService->updatePage($page, $request->validated(), auth()->id());

        return response()->json([
            'success' => true,
            'message' => 'Page updated successfully',
            'data' => new PageResource($page),
        ]);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $page = $this->pageRepository->findByUuid($uuid);
        if (!$page) abort(404, 'Page not found');
        $this->authorize('delete', $page);

        $this->pageRepository->delete($page);

        return response()->json([
            'success' => true,
            'message' => 'Page moved to trash successfully',
        ]);
    }

    public function publish(string $uuid): JsonResponse
    {
        $page = $this->pageRepository->findByUuid($uuid);
        if (!$page) abort(404, 'Page not found');
        $this->authorize('update', $page);

        $page = $this->pageService->updatePage($page, [
            'status' => 'published',
            'publish_date' => now(),
        ], auth()->id());

        return response()->json([
            'success' => true,
            'message' => 'Page published successfully',
            'data' => new PageResource($page),
        ]);
    }

    public function unpublish(string $uuid): JsonResponse
    {
        $page = $this->pageRepository->findByUuid($uuid);
        if (!$page) abort(404, 'Page not found');
        $this->authorize('update', $page);

        $page = $this->pageService->updatePage($page, ['status' => 'draft'], auth()->id());

        return response()->json([
            'success' => true,
            'message' => 'Page unpublished successfully',
            'data' => new PageResource($page),
        ]);
    }

    public function duplicate(string $uuid): JsonResponse
    {
        $page = $this->pageRepository->findByUuid($uuid);
        if (!$page) abort(404, 'Page not found');
        $this->authorize('create', Page::class);

        $replica = $this->pageService->duplicatePage($page, auth()->id());

        return response()->json([
            'success' => true,
            'message' => 'Page duplicated successfully',
            'data' => new PageResource($replica),
        ]);
    }
}
