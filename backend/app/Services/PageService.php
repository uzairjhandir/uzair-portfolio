<?php

namespace App\Services;

use App\Interfaces\PageRepositoryInterface;
use App\Models\Page;
use App\Models\PageRevision;
use Illuminate\Support\Str;

class PageService
{
    public function __construct(
        protected PageRepositoryInterface $pageRepository
    ) {}

    public function createPage(array $data, ?int $userId = null): Page
    {
        $data['slug'] = $this->generateUniqueSlug($data['slug'] ?? $data['title']);
        $data['preview_token'] = Str::random(32);
        if ($userId) {
            $data['author_id'] = $userId;
            $data['created_by'] = $userId;
        }

        $page = $this->pageRepository->create($data);
        
        $this->createRevision($page, 'v1.0', 'Initial Creation', $userId);
        
        return $page;
    }

    public function updatePage(Page $page, array $data, ?int $userId = null): Page
    {
        // 1. Snapshot current state before updating
        $latestRevision = $page->revisions()->first();
        $nextVersion = this->calculateNextVersion($latestRevision?->version ?? 'v1.0');
        
        $this->createRevision($page, $nextVersion, $data['change_summary'] ?? 'Update', $userId);

        // 2. Handle Slug Change -> 301 Redirect Architecture (Stubbed)
        if (isset($data['slug']) && $data['slug'] !== $page->slug) {
            $data['slug'] = $this->generateUniqueSlug($data['slug'], $page->id);
            // TODO: Hook into future RedirectManager
            // RedirectManager::create301($page->slug, $data['slug']);
        }

        if ($userId) {
            $data['updated_by'] = $userId;
        }

        $this->pageRepository->update($page, $data);
        
        return $page;
    }

    public function duplicatePage(Page $page, ?int $userId = null): Page
    {
        $newUuid = Str::uuid()->toString();
        $newTitle = $page->title . ' (Copy)';
        $newSlug = $this->generateUniqueSlug($page->slug . '-copy');
        
        $replica = $this->pageRepository->duplicate($page, $newUuid, $newSlug, $newTitle);
        
        if ($userId) {
            $replica->author_id = $userId;
            $replica->created_by = $userId;
            $replica->save();
        }

        $this->createRevision($replica, 'v1.0', 'Duplicated from ' . $page->title, $userId);

        return $replica;
    }

    private function createRevision(Page $page, string $version, string $summary, ?int $userId): void
    {
        PageRevision::create([
            'page_id' => $page->id,
            'version' => $version,
            'change_summary' => $summary,
            'blocks' => $page->blocks,
            'content' => $page->content,
            'created_by' => $userId,
        ]);
    }

    private function generateUniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $originalSlug = Str::slug($slug);
        $slug = $originalSlug;
        $count = 1;

        while (Page::where('slug', $slug)->when($ignoreId, function ($q) use ($ignoreId) {
            return $q->where('id', '!=', $ignoreId);
        })->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    private function calculateNextVersion(string $currentVersion): string
    {
        $parts = explode('.', str_replace('v', '', $currentVersion));
        $minor = (int) ($parts[1] ?? 0);
        $major = (int) ($parts[0] ?? 1);
        
        $minor++;
        if ($minor >= 10) {
            $minor = 0;
            $major++;
        }
        
        return "v{$major}.{$minor}";
    }
}
