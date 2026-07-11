<?php

namespace App\Modules\Downloads;

use App\Repositories\ContentRepository;
use Illuminate\Database\Eloquent\Collection;

class DownloadRepository extends ContentRepository
{
    public function __construct()
    {
        parent::__construct(Download::class);
    }

    public function featured(int $limit = 6): Collection
    {
        return Download::featured()
            ->orderByDesc('download_count')
            ->limit($limit)
            ->with(['seo', 'media', 'author'])
            ->get();
    }

    public function popular(int $limit = 10): Collection
    {
        return Download::where('status', 'published')
            ->orderByDesc('download_count')
            ->limit($limit)
            ->with(['media'])
            ->get();
    }
}
