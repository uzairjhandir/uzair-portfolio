<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Base API resource for all content types.
 * Returns the standard content envelope. Extend and add type-specific fields.
 *
 * Usage:
 *   class BlogResource extends AbstractContentResource
 *   {
 *       public function toArray(Request $request): array
 *       {
 *           return array_merge(parent::toArray($request), [
 *               'category' => $this->category?->name,
 *               'tags' => $this->tags->pluck('name'),
 *           ]);
 *       }
 *   }
 */
abstract class AbstractContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'status' => $this->status,
            'author' => $this->whenLoaded('author', fn() => [
                'uuid' => $this->author->uuid,
                'name' => $this->author->name,
            ]),
            'featured_image' => $this->whenLoaded('featuredImage', fn() =>
                $this->featuredImage ? new MediaResource($this->featuredImage) : null
            ),
            'seo' => $this->whenLoaded('seo', fn() => [
                'title' => $this->seo?->title,
                'description' => $this->seo?->description,
                'canonical_url' => $this->seo?->canonical_url,
                'robots' => $this->seo?->robots,
                'og' => [
                    'title' => $this->seo?->og_title,
                    'description' => $this->seo?->og_description,
                ],
            ]),
            'publish_at' => $this->publish_at?->toISOString(),
            'expire_at' => $this->expire_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
