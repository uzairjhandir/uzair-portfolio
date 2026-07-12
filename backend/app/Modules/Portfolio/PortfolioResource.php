<?php

namespace App\Modules\Portfolio;

use App\Http\Resources\AbstractContentResource;
use App\Http\Resources\MediaResource;
use Illuminate\Http\Request;

class PortfolioResource extends AbstractContentResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'content' => $this->content,
            // featuredImage() is a to-many pivot relation (see HasContentMedia); take
            // the first item of the eager-loaded collection rather than the base
            // resource's whenLoaded('featuredImage') handling (which assumes singular).
            'featured_image' => $this->whenLoaded('featuredImage', fn() =>
                ($img = $this->featuredImage->first()) ? new MediaResource($img) : null
            ),
            // Portfolio-specific fields
            'client_name'      => $this->client_name,
            'project_url'      => $this->project_url,
            'repository_url'   => $this->repository_url,
            'completion_date'  => $this->completion_date?->toDateString(),
            'is_featured'      => $this->is_featured,
            'is_open_source'   => $this->is_open_source,
            'project_status'   => $this->project_status,
            // Metrics (from HasContentMetrics)
            'metrics' => $this->whenLoaded('metrics', fn() => [
                'views'   => $this->metrics?->views ?? 0,
                'shares'  => $this->metrics?->shares ?? 0,
            ]),
            // Taxonomy via Core — filter the already-eager-loaded `terms` collection
            // (termsByTaxonomy() returns a Relation query builder, not a Collection).
            'categories' => $this->whenLoaded('terms', fn() =>
                $this->terms->filter(fn($t) => $t->taxonomy?->slug === 'category')->values()->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug,
                ])
            ),
            'technologies' => $this->whenLoaded('terms', fn() =>
                $this->terms->filter(fn($t) => $t->taxonomy?->slug === 'technology')->values()->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug, 'icon' => $t->icon,
                ])
            ),
            // Gallery via Core Media collections
            'gallery' => $this->whenLoaded('gallery', fn() => MediaResource::collection($this->gallery)),
        ]);
    }
}
