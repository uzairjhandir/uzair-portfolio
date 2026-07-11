<?php

namespace App\Repositories;

use App\Models\Page;
use App\Models\PageBlock;
use App\Models\PageVersion;
use App\Models\BuilderSession;
use Illuminate\Support\Str;

class PageBuilderRepository
{
    public function syncBlocks(Page $page, array $blocksData): void
    {
        // $blocksData structure: [['uuid' => 'block-uuid', 'instance_settings' => {}], ...]
        
        $page->pageBlocks()->delete(); // Clear current orchestration

        foreach ($blocksData as $index => $data) {
            PageBlock::create([
                'page_id' => $page->id,
                'block_id' => \App\Models\Block::where('uuid', $data['uuid'])->value('id'),
                'sort_order' => $index,
                'instance_settings' => $data['instance_settings'] ?? null,
                'visibility_rules' => $data['visibility_rules'] ?? null,
                'audience_rules' => $data['audience_rules'] ?? null,
                'conditions' => $data['conditions'] ?? null,
                'responsive_layout' => $data['responsive_layout'] ?? null,
                'animation_settings' => $data['animation_settings'] ?? null,
                'anchor' => $data['anchor'] ?? null,
            ]);
        }
    }

    public function lockPage(Page $page, int $userId): void
    {
        $page->lockForUser(User::find($userId));
    }

    public function unlockPage(Page $page): void
    {
        $page->releaseLock();
    }
    
    public function saveAutosaveState(BuilderSession $session, array $state): void
    {
        $session->update([
            'auto_saved_state' => $state,
            'expires_at' => now()->addHours(24),
        ]);
    }
    
    public function createVersionSnapshot(Page $page): PageVersion
    {
        return PageVersion::create([
            'page_id' => $page->id,
            'version' => 'v' . time(), // Simplified versioning for now
            'page_snapshot' => $page->toArray(),
            'attached_blocks_snapshot' => $page->pageBlocks()->with('block')->get()->toArray(),
            'seo_snapshot' => [
                'title' => $page->seo_title,
                'description' => $page->seo_description,
            ],
            'publish_state' => $page->status,
        ]);
    }
    
    public function restoreVersion(Page $page, string $version): bool
    {
        $pageVersion = PageVersion::where('page_id', $page->id)
            ->where('version', $version)
            ->firstOrFail();
            
        // Restore logic (Simplified for blueprint)
        // $page->update($pageVersion->page_snapshot);
        // $this->syncBlocks($page, $pageVersion->attached_blocks_snapshot);
        
        return true;
    }
}
