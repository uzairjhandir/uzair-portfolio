<?php

namespace App\Modules\Blog;

use App\Repositories\ContentRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * Blog-specific queries only.
 * Standard CRUD, search, and pagination come from ContentRepository.
 */
class BlogRepository extends ContentRepository
{
    public function __construct()
    {
        parent::__construct(Blog::class);
    }

    public function featured(int $limit = 6): Collection
    {
        return Blog::where('status', 'published')
            ->where('is_featured', true)
            ->orderByDesc('publish_at')
            ->limit($limit)
            ->with(['seo', 'author'])
            ->get();
    }

    public function pinned(int $limit = 3): Collection
    {
        return Blog::where('status', 'published')
            ->where('is_pinned', true)
            ->orderByDesc('publish_at')
            ->limit($limit)
            ->get();
    }

    public function relatedTo(Blog $blog, int $limit = 4): Collection
    {
        return $blog->relatedPosts()->take($limit);
    }

    public function byTaxonomyTerm(string $termSlug): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return Blog::where('status', 'published')
            ->whereHas('terms', fn($q) => $q->where('slug', $termSlug))
            ->orderByDesc('publish_at')
            ->paginate(12);
    }

    public function bySeries(string $seriesSlug): Collection
    {
        $series = BlogSeries::where('slug', $seriesSlug)->firstOrFail();
        return $series->posts()->where('status', 'published')->get();
    }
}
