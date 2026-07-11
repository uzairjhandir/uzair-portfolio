<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Routing\Controller;
use App\Interfaces\MediaRepositoryInterface;
use App\Services\MediaService;
use App\Http\Requests\Media\UploadMediaRequest;
use App\Http\Requests\Media\UpdateMediaMetadataRequest;
use App\Http\Requests\Media\MoveMediaRequest;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(
        protected MediaRepositoryInterface $mediaRepository,
        protected MediaService $mediaService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Media::class);
        $filters = $request->only(['folder_uuid', 'search', 'mime_type', 'trashed']);
        $perPage = $request->query('per_page', 20);

        $media = $this->mediaRepository->search($filters, $perPage);

        return response()->json([
            'success' => true,
            'message' => 'Media retrieved successfully',
            'data' => MediaResource::collection($media),
            'errors' => null,
            'meta' => [
                'total' => $media->total(),
                'per_page' => $media->perPage(),
                'current_page' => $media->currentPage(),
                'last_page' => $media->lastPage(),
            ]
        ]);
    }

    public function store(UploadMediaRequest $request): JsonResponse
    {
        $this->authorize('create', Media::class);
        
        $folderId = null;
        if ($request->has('folder_uuid') && $request->folder_uuid) {
            $folder = \App\Models\MediaFolder::where('uuid', $request->folder_uuid)->first();
            if ($folder) $folderId = $folder->id;
        }

        $media = $this->mediaService->handleUpload($request->file('file'), $folderId, auth()->id());

        return response()->json([
            'success' => true,
            'message' => 'Media uploaded successfully',
            'data' => new MediaResource($media),
            'errors' => null,
            'meta' => null
        ], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $media = $this->mediaRepository->findByUuid($uuid);
        if (!$media) abort(404, 'Media not found');
        $this->authorize('view', $media);

        return response()->json([
            'success' => true,
            'message' => 'Media retrieved successfully',
            'data' => new MediaResource($media),
            'errors' => null,
            'meta' => null
        ]);
    }

    public function updateMetadata(UpdateMediaMetadataRequest $request, string $uuid): JsonResponse
    {
        $media = $this->mediaRepository->findByUuid($uuid);
        if (!$media) abort(404, 'Media not found');
        $this->authorize('update', $media);

        $this->mediaRepository->updateMetadata($media, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Media metadata updated successfully',
            'data' => new MediaResource($media),
            'errors' => null,
            'meta' => null
        ]);
    }

    public function replace(UploadMediaRequest $request, string $uuid): JsonResponse
    {
        $media = $this->mediaRepository->findByUuid($uuid);
        if (!$media) abort(404, 'Media not found');
        $this->authorize('update', $media);

        $media = $this->mediaService->replaceMedia($media, $request->file('file'));

        return response()->json([
            'success' => true,
            'message' => 'Media replaced successfully',
            'data' => new MediaResource($media),
            'errors' => null,
            'meta' => null
        ]);
    }

    public function bulkMove(MoveMediaRequest $request): JsonResponse
    {
        $this->authorize('updateAny', Media::class);
        
        $this->mediaRepository->moveBulk($request->validated('media_uuids'), $request->validated('folder_uuid'));

        return response()->json([
            'success' => true,
            'message' => 'Media moved successfully',
            'data' => null,
            'errors' => null,
            'meta' => null
        ]);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $media = $this->mediaRepository->findByUuid($uuid);
        if (!$media) abort(404, 'Media not found');
        $this->authorize('delete', $media);

        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media moved to trash successfully',
            'data' => null,
            'errors' => null,
            'meta' => null
        ]);
    }

    public function restore(string $uuid): JsonResponse
    {
        $media = $this->mediaRepository->findByUuid($uuid);
        if (!$media) abort(404, 'Media not found');
        $this->authorize('restore', $media);

        $media->restore();

        return response()->json([
            'success' => true,
            'message' => 'Media restored successfully',
            'data' => new MediaResource($media),
            'errors' => null,
            'meta' => null
        ]);
    }
}
