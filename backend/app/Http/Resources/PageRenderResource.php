<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageRenderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'page' => [
                'uuid' => $this->uuid,
                'title' => $this->title,
                'slug' => $this->slug,
                'seo' => [
                    'title' => $this->seo_title,
                    'description' => $this->seo_description,
                ],
                'status' => $this->status,
            ],
            'layout' => $this->layout_settings ?? [],
            'blocks' => $this->pageBlocks->map(function ($pageBlock) {
                return [
                    'uuid' => $pageBlock->block->uuid,
                    'type' => $pageBlock->block->type->slug,
                    'anchor' => $pageBlock->anchor,
                    'sort_order' => $pageBlock->sort_order,
                    'content' => $pageBlock->block->content, // Could use BlockResource here
                    'instance_settings' => $pageBlock->instance_settings,
                    'visibility' => $pageBlock->visibility_rules,
                    'responsive' => $pageBlock->responsive_layout,
                    'animation' => $pageBlock->animation_settings,
                ];
            }),
        ];
    }
}
