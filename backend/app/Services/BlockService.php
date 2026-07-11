<?php

namespace App\Services;

use App\Interfaces\BlockRepositoryInterface;
use App\Models\Block;
use App\Models\BlockRevision;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class BlockService
{
    public function __construct(
        protected BlockRepositoryInterface $blockRepository
    ) {}

    public function createBlock(array $data, ?int $userId = null): Block
    {
        if ($userId) {
            $data['created_by'] = $userId;
        }

        $data['search_content'] = $this->generateSearchContent($data['content'] ?? []);
        
        $block = $this->blockRepository->create($data);
        
        $this->createRevision($block, 'v1.0', 'Initial Creation', $userId);
        
        return $block;
    }

    public function updateBlock(Block $block, array $data, ?int $userId = null): Block
    {
        if ($block->is_locked && !auth()->user()?->can('unlock-blocks')) {
            abort(403, 'This block is locked and cannot be edited.');
        }

        $latestRevision = $block->revisions()->first();
        $nextVersion = $this->calculateNextVersion($latestRevision?->version ?? 'v1.0');
        
        $this->createRevision($block, $nextVersion, $data['comment'] ?? 'Update', $userId);

        if (isset($data['content'])) {
            $data['search_content'] = $this->generateSearchContent($data['content']);
        }

        if ($userId) {
            $data['updated_by'] = $userId;
        }

        $this->blockRepository->update($block, $data);
        
        if ($block->is_global) {
            $this->clearBlockCache($block->uuid);
        }
        
        return $block;
    }

    public function duplicateBlock(Block $block, ?int $userId = null): Block
    {
        $newUuid = Str::uuid()->toString();
        $replica = $this->blockRepository->duplicate($block, $newUuid);
        
        if ($userId) {
            $replica->created_by = $userId;
            $replica->save();
        }

        $this->createRevision($replica, 'v1.0', 'Duplicated from ' . $block->uuid, $userId);

        return $replica;
    }

    private function createRevision(Block $block, string $version, string $comment, ?int $userId): void
    {
        BlockRevision::create([
            'block_id' => $block->id,
            'version' => $version,
            'comment' => $comment,
            'content_snapshot' => $block->content,
            'settings_snapshot' => $block->settings,
            'status' => $block->status,
            'created_by' => $userId,
        ]);
    }

    private function generateSearchContent(array $content): string
    {
        // Recursively extract all strings from the JSON content for blazing fast global search indexing.
        $strings = [];
        array_walk_recursive($content, function ($item) use (&$strings) {
            if (is_string($item)) {
                $strings[] = strip_tags($item);
            }
        });
        return implode(' ', $strings);
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

    public function clearBlockCache(string $uuid): void
    {
        Cache::forget("block.{$uuid}");
    }
}
