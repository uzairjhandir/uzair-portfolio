<?php

namespace App\Modules\Portfolio;

use App\Http\Controllers\Api\V1\AbstractContentController;

/**
 * Portfolio controller.
 * Inherits all 16 standard actions from AbstractContentController.
 * Portfolio-unique endpoints:
 *   GET /portfolios/featured
 *   GET /portfolios/open-source
 *   POST /portfolios/{uuid}/view   ← records a view via ContentMetricsService
 */
class PortfolioController extends AbstractContentController
{
    protected string $modelClass    = Portfolio::class;
    protected string $resourceClass = PortfolioResource::class;

    public function __construct(
        \App\Services\ContentPublishingService $publishingService,
        \App\Services\ContentRevisionService $revisionService,
        private PortfolioRepository $portfolioRepository,
        private \App\Core\Metrics\ContentMetricsService $metricsService,
    ) {
        parent::__construct($publishingService, $revisionService);
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
