<?php

namespace App\Modules\CaseStudy;

use App\Repositories\ContentRepository;
use Illuminate\Database\Eloquent\Collection;

class CaseStudyRepository extends ContentRepository
{
    public function __construct()
    {
        parent::__construct(CaseStudy::class);
    }

    public function featured(int $limit = 6): Collection
    {
        return CaseStudy::featured()
            ->orderByDesc('publish_at')
            ->limit($limit)
            ->with(['seo', 'portfolio', 'author'])
            ->get();
    }

    public function byPortfolio(string $portfolioUuid): Collection
    {
        return CaseStudy::where('status', 'published')
            ->whereHas('portfolio', fn($q) => $q->where('uuid', $portfolioUuid))
            ->orderByDesc('is_primary') // Primary first
            ->orderByDesc('publish_at')
            ->get();
    }
}
