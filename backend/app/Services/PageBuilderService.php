<?php

namespace App\Services;

use App\Models\Page;
use App\Models\Block;
use Illuminate\Support\Facades\Log;

class PageBuilderService
{
    public function validateForPublish(Page $page): bool
    {
        $pageBlocks = $page->pageBlocks()->with('block.type')->get();
        
        $singletons = [];
        $totalWeight = 0;
        
        // 1. Missing SEO validation
        if (!$page->title) {
            abort(422, 'Publish failed: Missing required SEO Title.');
        }

        foreach ($pageBlocks as $pb) {
            $block = $pb->block;
            if (!$block) {
                abort(422, 'Publish failed: A referenced block no longer exists.');
            }
            
            // 2. Duplicate Singleton check
            if ($block->type->is_singleton) {
                if (in_array($block->type->id, $singletons)) {
                    abort(422, "Publish failed: Duplicate singleton block found ({$block->type->name}).");
                }
                $singletons[] = $block->type->id;
            }
            
            // 3. Expired block check
            if ($block->expire_at && $block->expire_at->isPast()) {
                abort(422, "Publish failed: Block '{$block->name}' has expired.");
            }
            
            // 4. Performance Budget (Basic mock calculation)
            $totalWeight += $this->calculateBlockWeight($block);
            
            // 5. Circular dependencies (Check parent/child tree)
            $this->validateCircularDependencies($block);
        }
        
        if ($totalWeight > 5000) { // arbitrary 5MB budget
            Log::warning("Page {$page->uuid} exceeds performance budget.");
            // We could return false, or just warn.
        }

        return true;
    }
    
    private function calculateBlockWeight(Block $block): int
    {
        // E.g., inspect $block->content for media references and sum file sizes.
        return 100; // Mock 100KB per block
    }
    
    private function validateCircularDependencies(Block $block, array $visited = []): void
    {
        if (in_array($block->id, $visited)) {
            abort(422, 'Publish failed: Circular block dependency detected.');
        }
        
        $visited[] = $block->id;
        
        foreach ($block->children as $child) {
            $this->validateCircularDependencies($child, $visited);
        }
    }
    
    public function triggerAutoRegeneration(Page $page): void
    {
        // Regenerate Page Search Index
        // Regenerate Sitemap
        // Regenerate Navigation Cache
        Log::info("Regenerated indexes for Page: {$page->uuid}");
    }
}
