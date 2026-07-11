<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Interfaces\MediaFolderRepositoryInterface;
use App\Http\Resources\MediaFolderResource;
use App\Models\MediaFolder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaFolderController extends Controller
{
    public function __construct(
        protected MediaFolderRepositoryInterface $folderRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', MediaFolder::class);
        
        $tree = $this->folderRepository->getTree();

        return response()->json([
            'success' => true,
            'message' => 'Media folders retrieved successfully',
            'data' => MediaFolderResource::collection($tree),
            'errors' => null,
            'meta' => null
        ]);
    }

    // Additional typical CRUD methods for Folders (store, show, update, destroy)
}
