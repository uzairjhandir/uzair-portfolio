<?php

namespace App\Modules\CaseStudy;

use App\Http\Controllers\Api\V1\AbstractContentController;
use Illuminate\Http\Request;

/**
 * Case Study controller.
 * Inherits all 16 standard actions from AbstractContentController, with
 * index/show/store/update overridden to eager-load featuredImage/gallery/
 * portfolio/seo/terms and to sync SEO + taxonomy (categories/technologies),
 * neither of which the base controller's generic $fillable-only create/
 * update can reach. Mirrors BlogController/PortfolioController.
 *
 * Case Study-unique endpoints:
 *   GET /case-studies/featured
 *   GET /case-studies/by-portfolio/{uuid}
 */
class CaseStudyController extends AbstractContentController
{
    protected string $modelClass    = CaseStudy::class;
    protected string $resourceClass = CaseStudyResource::class;

    private const EAGER = ['featuredImage', 'gallery', 'portfolio', 'author', 'seo', 'terms'];

    public function __construct(
        \App\Services\ContentPublishingService $publishingService,
        \App\Services\ContentRevisionService $revisionService,
        private CaseStudyRepository $caseStudyRepository,
    ) {
        parent::__construct($publishingService, $revisionService);
    }

    public function index(Request $request)
    {
        $query = CaseStudy::with(self::EAGER);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $sortBy = in_array($request->query('sort_by'), ['title', 'created_at', 'updated_at'])
            ? $request->query('sort_by')
            : 'created_at';
        $sortDir = $request->query('sort_dir') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $items = $query->paginate((int) $request->query('per_page', 15));
        return CaseStudyResource::collection($items);
    }

    public function show(string $uuid)
    {
        $item = CaseStudy::with(self::EAGER)->where('uuid', $uuid)->firstOrFail();
        return new CaseStudyResource($item);
    }

    public function store(Request $request)
    {
        $data = $request->except(['seo', 'categories', 'technologies', 'gallery', 'portfolio_uuid', 'featured_image_id']);
        $data['portfolio_id'] = $this->resolvePortfolioId($request);
        $item = CaseStudy::create($data);
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentCreated($item));
        return new CaseStudyResource($item->fresh(self::EAGER));
    }

    public function update(Request $request, string $uuid)
    {
        $item = CaseStudy::where('uuid', $uuid)->firstOrFail();
        $data = $request->except(['seo', 'categories', 'technologies', 'gallery', 'portfolio_uuid', 'featured_image_id']);
        if ($request->has('portfolio_uuid')) {
            $data['portfolio_id'] = $this->resolvePortfolioId($request);
        }
        $item->update($data);
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentUpdated($item));
        return new CaseStudyResource($item->fresh(self::EAGER));
    }

    /**
     * Every other relation in this API is UUID-based (categories, technologies,
     * featured image, etc.) — resolve portfolio_uuid to the internal integer FK
     * the same way syncTerms() resolves taxonomy term UUIDs, so the frontend
     * never has to know about internal auto-increment IDs.
     */
    private function resolvePortfolioId(Request $request): ?int
    {
        $uuid = $request->input('portfolio_uuid');
        if (!$uuid) {
            return null;
        }
        return \App\Modules\Portfolio\Portfolio::where('uuid', $uuid)->value('id');
    }

    private function syncRelations(CaseStudy $item, Request $request): void
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

    /** GET /public/case-studies — published-only, no auth. */
    public function publicIndex(Request $request)
    {
        $query = CaseStudy::with(self::EAGER)->where('status', 'published');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $sortBy = in_array($request->query('sort_by'), ['title', 'created_at', 'updated_at'])
            ? $request->query('sort_by')
            : 'created_at';
        $sortDir = $request->query('sort_dir') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $items = $query->paginate((int) $request->query('per_page', 15));
        return CaseStudyResource::collection($items);
    }

    /** GET /public/case-studies/{slugOrUuid} — published-only, no auth. Matches by slug or uuid. */
    public function publicShow(string $slugOrUuid)
    {
        $item = CaseStudy::with(self::EAGER)
            ->where('status', 'published')
            ->where(fn($q) => $q->where('slug', $slugOrUuid)->orWhere('uuid', $slugOrUuid))
            ->firstOrFail();
        return new CaseStudyResource($item);
    }

    /** GET /case-studies/featured */
    public function featured(): \Illuminate\Http\JsonResponse
    {
        return response()->json(CaseStudyResource::collection($this->caseStudyRepository->featured()));
    }

    /** GET /case-studies/by-portfolio/{portfolioUuid} */
    public function byPortfolio(string $portfolioUuid): \Illuminate\Http\JsonResponse
    {
        $items = $this->caseStudyRepository->byPortfolio($portfolioUuid);
        return response()->json(CaseStudyResource::collection($items));
    }
}
