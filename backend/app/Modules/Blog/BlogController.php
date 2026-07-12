<?php

namespace App\Modules\Blog;

use App\Http\Controllers\Api\V1\AbstractContentController;
use Illuminate\Http\Request;

/**
 * Blog controller.
 * Inherits all 16 standard actions from AbstractContentController, with
 * index/show/store/update overridden to eager-load featuredImage/seo/terms
 * and to sync SEO + taxonomy (categories/tags), neither of which the base
 * controller's generic $fillable-only create/update can reach (they're
 * separate related models, not columns on `blogs`).
 *
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

    private const EAGER = ['featuredImage', 'author', 'seo', 'terms'];

    public function __construct(
        \App\Services\ContentPublishingService $publishingService,
        \App\Services\ContentRevisionService $revisionService,
        private BlogRepository $blogRepository,
    ) {
        parent::__construct($publishingService, $revisionService);
    }

    public function index(Request $request)
    {
        $items = Blog::with(self::EAGER)->latest()->paginate(15);
        return BlogResource::collection($items);
    }

    public function show(string $uuid)
    {
        $item = Blog::with(self::EAGER)->where('uuid', $uuid)->firstOrFail();
        return new BlogResource($item);
    }

    public function store(Request $request)
    {
        $item = Blog::create($request->except(['seo', 'categories', 'tags']));
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentCreated($item));
        return new BlogResource($item->fresh(self::EAGER));
    }

    public function update(Request $request, string $uuid)
    {
        $item = Blog::where('uuid', $uuid)->firstOrFail();
        $item->update($request->except(['seo', 'categories', 'tags']));
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentUpdated($item));
        return new BlogResource($item->fresh(self::EAGER));
    }

    private function syncRelations(Blog $item, Request $request): void
    {
        if ($request->has('seo') && is_array($request->input('seo'))) {
            $item->syncSeo($request->input('seo'));
        }
        if ($request->has('categories')) {
            $item->syncTerms('category', $request->input('categories', []));
        }
        if ($request->has('tags')) {
            $item->syncTerms('tag', $request->input('tags', []));
        }
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
