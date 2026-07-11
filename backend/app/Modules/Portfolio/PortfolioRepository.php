<?php

namespace App\Modules\Portfolio;

use App\Repositories\ContentRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Portfolio-specific queries only.
 * Standard CRUD, pagination, search come from ContentRepository.
 */
class PortfolioRepository extends ContentRepository
{
    public function __construct()
    {
        parent::__construct(Portfolio::class);
    }

    public function featured(int $limit = 6): Collection
    {
        return Portfolio::featured()
            ->orderByDesc('completion_date')
            ->limit($limit)
            ->with(['seo', 'author'])
            ->get();
    }

    public function openSource(int $limit = 12): Collection
    {
        return Portfolio::openSource()
            ->orderByDesc('completion_date')
            ->limit($limit)
            ->get();
    }

    public function byTechnology(string $techSlug): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return Portfolio::where('status', 'published')
            ->whereHas('terms', fn($q) => $q->where('slug', $techSlug))
            ->orderByDesc('completion_date')
            ->paginate(12);
    }

    public function byClient(string $clientName): Collection
    {
        return Portfolio::where('status', 'published')
            ->where('client_name', $clientName)
            ->orderByDesc('completion_date')
            ->get();
    }
}
