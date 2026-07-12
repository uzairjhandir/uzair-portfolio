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
        $query = Blog::with(self::EAGER);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $sortBy = in_array($request->query('sort_by'), ['title', 'created_at', 'publish_at', 'updated_at'])
            ? $request->query('sort_by')
            : 'created_at';
        $sortDir = $request->query('sort_dir') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $items = $query->paginate((int) $request->query('per_page', 15));
        return BlogResource::collection($items);
    }

    public function show(string $uuid)
    {
        $item = Blog::with(self::EAGER)->where('uuid', $uuid)->firstOrFail();
        return new BlogResource($item);
    }

    public function store(Request $request)
    {
        $data = $this->resolveFeaturedImageId($request->except(['seo', 'categories', 'tags']));
        $item = Blog::create($data);
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentCreated($item));
        return new BlogResource($item->fresh(self::EAGER));
    }

    public function update(Request $request, string $uuid)
    {
        $item = Blog::where('uuid', $uuid)->firstOrFail();
        $data = $this->resolveFeaturedImageId($request->except(['seo', 'categories', 'tags']));
        $item->update($data);
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentUpdated($item));
        return new BlogResource($item->fresh(self::EAGER));
    }

    /**
     * Every other relation in this API is UUID-based (categories, tags,
     * portfolio_uuid on Case Study, etc.), but featured_image_id is a raw
     * integer FK column, and the frontend's MediaPickerField only ever
     * knows a media item's UUID. Resolve it here the same way
     * CaseStudyController resolves portfolio_uuid, so the frontend never
     * has to know about internal auto-increment IDs.
     */
    private function resolveFeaturedImageId(array $data): array
    {
        if (!empty($data['featured_image_id']) && !is_numeric($data['featured_image_id'])) {
            $data['featured_image_id'] = \App\Models\Media::where('uuid', $data['featured_image_id'])->value('id');
        }
        return $data;
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

    /**
     * GET /public/blogs — published-only, no auth. Same query logic as
     * index() but status is hard-forced (never trusts a client-supplied
     * status filter) so drafts can never leak through the public route.
     */
    public function publicIndex(Request $request)
    {
        $query = Blog::with(self::EAGER)->where('status', 'published');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $sortBy = in_array($request->query('sort_by'), ['title', 'created_at', 'publish_at', 'updated_at'])
            ? $request->query('sort_by')
            : 'publish_at';
        $sortDir = $request->query('sort_dir') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $items = $query->paginate((int) $request->query('per_page', 15));
        return BlogResource::collection($items);
    }

    /** GET /public/blogs/{slugOrUuid} — published-only, no auth. Matches by slug (public URLs) or uuid. */
    public function publicShow(string $slugOrUuid)
    {
        $item = Blog::with(self::EAGER)
            ->where('status', 'published')
            ->where(fn($q) => $q->where('slug', $slugOrUuid)->orWhere('uuid', $slugOrUuid))
            ->firstOrFail();
        return new BlogResource($item);
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
