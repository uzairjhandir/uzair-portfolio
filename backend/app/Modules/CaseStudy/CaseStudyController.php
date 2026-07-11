<?php

namespace App\Modules\CaseStudy;

use App\Http\Controllers\Api\V1\AbstractContentController;

/**
 * Case Study controller.
 * Inherits all 16 standard actions. Zero standard methods overridden.
 *
 * Case Study-unique endpoints:
 *   GET /case-studies/featured
 *   GET /case-studies/by-portfolio/{uuid}
 */
class CaseStudyController extends AbstractContentController
{
    protected string $modelClass    = CaseStudy::class;
    protected string $resourceClass = CaseStudyResource::class;

    public function __construct(
        \App\Services\ContentPublishingService $publishingService,
        \App\Services\ContentRevisionService $revisionService,
        private CaseStudyRepository $caseStudyRepository,
    ) {
        parent::__construct($publishingService, $revisionService);
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
