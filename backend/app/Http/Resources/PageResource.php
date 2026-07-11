<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'slug' => $this->slug,
            'breadcrumb_title' => $this->breadcrumb_title,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'blocks' => $this->blocks,
            'template' => $this->template,
            'layout' => $this->layout,
            'type' => $this->type,
            'status' => $this->status,
            'visibility' => $this->visibility,
            'publish_date' => $this->publish_date?->toIso8601String(),
            'expire_date' => $this->expire_date?->toIso8601String(),
            'sort_order' => $this->sort_order,
            
            // URLs
            'preview_url' => env('APP_FRONTEND_URL') . '/api/preview?token=' . $this->preview_token . '&slug=' . $this->slug,
            
            // Navigation
            'navigation' => [
                'show_in_header' => $this->show_in_header,
                'show_in_footer' => $this->show_in_footer,
                'show_in_sitemap' => $this->show_in_sitemap,
                'show_in_search' => $this->show_in_search,
                'show_in_breadcrumb' => $this->show_in_breadcrumb,
                'menu' => $this->navigation_menu,
                'order' => $this->navigation_order,
                'icon' => $this->navigation_icon,
                'badge' => $this->navigation_badge,
            ],
            
            // Sitemap
            'sitemap' => [
                'priority' => $this->sitemap_priority,
                'change_frequency' => $this->sitemap_change_frequency,
                'last_modified' => $this->sitemap_last_modified?->toIso8601String(),
            ],
            
            // Relationships
            'author' => new UserResource($this->whenLoaded('author')),
            'featured_image' => new MediaResource($this->whenLoaded('featuredImage')),
            'banner' => new MediaResource($this->whenLoaded('banner')),
            'og_image' => new MediaResource($this->whenLoaded('ogImage')),
            'children' => PageResource::collection($this->whenLoaded('children')),
            
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
