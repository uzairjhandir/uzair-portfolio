<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Interfaces\BlockRepositoryInterface;
use App\Services\BlockService;
use App\Http\Requests\Blocks\CreateBlockRequest;
use App\Http\Requests\Blocks\UpdateBlockRequest;
use App\Http\Resources\BlockResource;
use App\Models\Block;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    public function __construct(
        protected BlockRepositoryInterface $blockRepository,
        protected BlockService $blockService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Block::class);
        $filters = $request->only(['search', 'is_global', 'status', 'category']);
        
        $blocks = $this->blockRepository->search($filters, $request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => BlockResource::collection($blocks),
            'meta' => [
                'total' => $blocks->total(),
                'per_page' => $blocks->perPage(),
                'current_page' => $blocks->currentPage(),
            ]
        ]);
    }

    public function store(CreateBlockRequest $request): JsonResponse
    {
        $this->authorize('create', Block::class);

        $block = $this->blockService->createBlock($request->validated(), auth()->id());

        return response()->json([
            'success' => true,
            'data' => new BlockResource($block),
        ], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $block = $this->blockRepository->findByUuid($uuid);
        if (!$block) abort(404, 'Block not found');
        $this->authorize('view', $block);

        return response()->json([
            'success' => true,
            'data' => new BlockResource($block),
        ]);
    }

    public function update(UpdateBlockRequest $request, string $uuid): JsonResponse
    {
        $block = $this->blockRepository->findByUuid($uuid);
        if (!$block) abort(404, 'Block not found');
        $this->authorize('update', $block);

        $block = $this->blockService->updateBlock($block, $request->validated(), auth()->id());

        return response()->json([
            'success' => true,
            'data' => new BlockResource($block),
        ]);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $block = $this->blockRepository->findByUuid($uuid);
        if (!$block) abort(404, 'Block not found');
        $this->authorize('delete', $block);
        
        if ($block->is_locked && !auth()->user()?->can('unlock-blocks')) {
            abort(403, 'This block is locked and cannot be deleted.');
        }

        $this->blockRepository->delete($block);

        return response()->json([
            'success' => true,
        ]);
    }

    public function duplicate(string $uuid): JsonResponse
    {
        $block = $this->blockRepository->findByUuid($uuid);
        if (!$block) abort(404, 'Block not found');
        $this->authorize('create', Block::class);

        $replica = $this->blockService->duplicateBlock($block, auth()->id());

        return response()->json([
            'success' => true,
            'data' => new BlockResource($replica),
        ]);
    }
    
    public function preview(Request $request): JsonResponse
    {
        // Ephemeral preview generation for React Admin
        return response()->json([
            'success' => true,
            'message' => 'Preview generated successfully (Stubbed)',
            'data' => []
        ]);
    }
}
