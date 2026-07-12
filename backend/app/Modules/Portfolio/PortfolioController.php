<?php

namespace App\Modules\Portfolio;

use App\Http\Controllers\Api\V1\AbstractContentController;
use Illuminate\Http\Request;

/**
 * Portfolio controller.
 * Inherits all 16 standard actions from AbstractContentController, with
 * index/show/store/update overridden to eager-load featuredImage/gallery/seo/terms
 * and to sync SEO + taxonomy (categories/technologies), neither of which the base
 * controller's generic $fillable-only create/update can reach (they're
 * separate related models, not columns on `portfolios`). Mirrors BlogController.
 *
 * Portfolio-unique endpoints only:
 *   GET /portfolios/featured
 *   GET /portfolios/open-source
 *   POST /portfolios/{uuid}/view   ← records a view via ContentMetricsService
 */
class PortfolioController extends AbstractContentController
{
    protected string $modelClass    = Portfolio::class;
    protected string $resourceClass = PortfolioResource::class;

    private const EAGER = ['featuredImage', 'gallery', 'author', 'seo', 'terms'];

    public function __construct(
        \App\Services\ContentPublishingService $publishingService,
        \App\Services\ContentRevisionService $revisionService,
        private PortfolioRepository $portfolioRepository,
        private \App\Core\Metrics\ContentMetricsService $metricsService,
    ) {
        parent::__construct($publishingService, $revisionService);
    }

    public function index(Request $request)
    {
        $query = Portfolio::with(self::EAGER);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $sortBy = in_array($request->query('sort_by'), ['title', 'created_at', 'completion_date', 'updated_at'])
            ? $request->query('sort_by')
            : 'created_at';
        $sortDir = $request->query('sort_dir') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $items = $query->paginate((int) $request->query('per_page', 15));
        return PortfolioResource::collection($items);
    }

    public function show(string $uuid)
    {
        $item = Portfolio::with(self::EAGER)->where('uuid', $uuid)->firstOrFail();
        return new PortfolioResource($item);
    }

    public function store(Request $request)
    {
        $item = Portfolio::create($request->except(['seo', 'categories', 'technologies', 'gallery', 'featured_image_id']));
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentCreated($item));
        return new PortfolioResource($item->fresh(self::EAGER));
    }

    public function update(Request $request, string $uuid)
    {
        $item = Portfolio::where('uuid', $uuid)->firstOrFail();
        $item->update($request->except(['seo', 'categories', 'technologies', 'gallery', 'featured_image_id']));
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentUpdated($item));
        return new PortfolioResource($item->fresh(self::EAGER));
    }

    private function syncRelations(Portfolio $item, Request $request): void
    {
        if ($request->has('seo') && is_array($request->input('seo'))) {
            $item->syncSeo($request->input('seo'));
        }
        if ($request->has('categories')) {
            $item->syncTerms('category', $request->input('categories', []));
        }
        if ($request->has('technologies')) {
            $item->syncTerms('technology', $request->input('technologies', []));
        }
        if ($request->has('gallery')) {
            $item->syncMedia('gallery', $request->input('gallery', []));
        }
        if ($request->has('featured_image_id')) {
            $uuid = $request->input('featured_image_id');
            $item->syncMedia('featured', $uuid ? [$uuid] : []);
        }
    }

    /** GET /portfolios/featured */
    public function featured(): \Illuminate\Http\JsonResponse
    {
        return response()->json(PortfolioResource::collection($this->portfolioRepository->featured()));
    }

    /** GET /portfolios/open-source */
    public function openSource(): \Illuminate\Http\JsonResponse
    {
        return response()->json(PortfolioResource::collection($this->portfolioRepository->openSource()));
    }

    /** POST /portfolios/{uuid}/view — records a view in ContentMetricsService */
    public function recordView(string $uuid): \Illuminate\Http\JsonResponse
    {
        $portfolio = Portfolio::where('uuid', $uuid)->firstOrFail();
        $this->metricsService->incrementViews($portfolio);
        return response()->json(['message' => 'View recorded.']);
    }
}
