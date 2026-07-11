<?php

namespace App\Modules\Blog;

use App\Http\Controllers\Api\V1\AbstractContentController;

/**
 * Blog controller.
 * Inherits all 16 standard actions from AbstractContentController.
 * Blog-unique endpoints only:
 *   GET /blogs/featured
 *   GET /blogs/pinned
 *   GET /blogs/{uuid}/related
 *
 * RSS feed moved to Core/Feeds — GET /api/v1/feed/blog.xml
 */
class BlogController extends AbstractContentController
{
    protected string $modelClass    = Blog::class;
    protected string $resourceClass = BlogResource::class;

    public function __construct(
        \App\Services\ContentPublishingService $publishingService,
        \App\Services\ContentRevisionService $revisionService,
        private BlogRepository $blogRepository,
    ) {
        parent::__construct($publishingService, $revisionService);
    }

    /** GET /blogs/featured */
    public function featured(): \Illuminate\Http\JsonResponse
    {
        return response()->json(BlogResource::collection($this->blogRepository->featured()));
    }

    /** GET /blogs/pinned */
    public function pinned(): \Illuminate\Http\JsonResponse
    {
        return response()->json(BlogResource::collection($this->blogRepository->pinned()));
    }

    /** GET /blogs/{uuid}/related */
    public function related(string $uuid): \Illuminate\Http\JsonResponse
    {
        $blog = Blog::where('uuid', $uuid)->firstOrFail();
        return response()->json(BlogResource::collection($this->blogRepository->relatedTo($blog)));
    }
}
