<?php

namespace App\Modules\Portfolio;

use App\Http\Resources\AbstractContentResource;
use Illuminate\Http\Request;

class PortfolioResource extends AbstractContentResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
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
            // Taxonomy via Core
            'technologies' => $this->whenLoaded('terms', fn() =>
                $this->termsByTaxonomy('technology')->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug, 'icon' => $t->icon,
                ])
            ),
            'industries' => $this->whenLoaded('terms', fn() =>
                $this->termsByTaxonomy('industry')->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug,
                ])
            ),
            // Gallery via Core Media collections
            'gallery' => $this->whenLoaded('gallery'),
        ]);
    }
}
