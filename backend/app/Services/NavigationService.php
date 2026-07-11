<?php

namespace App\Services;

use App\Interfaces\NavigationRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class NavigationService
{
    public function __construct(
        protected NavigationRepositoryInterface $navigationRepository
    ) {}

    public function getCachedMenuTree(string $location)
    {
        return Cache::rememberForever("navigation.{$location}", function () use ($location) {
            return $this->navigationRepository->getMenuTree($location);
        });
    }

    public function clearMenuCache(string $location): void
    {
        Cache::forget("navigation.{$location}");
    }

    public function reorder(string $location, array $treeData): bool
    {
        $result = $this->navigationRepository->reorder($treeData);
        if ($result) {
            $this->clearMenuCache($location);
        }
        return $result;
    }
}
