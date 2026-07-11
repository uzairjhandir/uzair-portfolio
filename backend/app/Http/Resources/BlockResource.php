<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'type' => $this->type ? $this->type->slug : null,
            'name' => $this->name,
            'variant' => $this->variant,
            'is_global' => $this->is_global,
            'is_locked' => $this->is_locked,
            'content' => $this->content,
            'settings' => $this->settings,
            'status' => $this->status,
            'version' => $this->version,
            'is_searchable' => $this->is_searchable,
            
            'publish_at' => $this->publish_at?->toIso8601String(),
            'expire_at' => $this->expire_at?->toIso8601String(),
            
            // Nested Blocks
            'children' => BlockResource::collection($this->whenLoaded('children')),
            
            // Revisions
            'revisions' => $this->whenLoaded('revisions', function () {
                return $this->revisions->map(function ($rev) {
                    return [
                        'version' => $rev->version,
                        'comment' => $rev->comment,
                        'created_at' => $rev->created_at->toIso8601String(),
                    ];
                });
            }),
            
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
