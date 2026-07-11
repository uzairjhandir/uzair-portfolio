<?php

namespace App\Modules\CaseStudy;

use App\Http\Resources\AbstractContentResource;
use Illuminate\Http\Request;

class CaseStudyResource extends AbstractContentResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            // Portfolio link
            'portfolio' => $this->whenLoaded('portfolio', fn() => [
                'uuid'  => $this->portfolio->uuid,
                'title' => $this->portfolio->title,
                'slug'  => $this->portfolio->slug,
            ]),
            'is_primary'   => $this->is_primary,
            'is_featured'  => $this->is_featured,
            // Narrative sections
            'challenge'      => $this->challenge,
            'solution'       => $this->solution,
            'implementation' => $this->implementation,
            'results'        => $this->results,
            'customer_quote' => $this->customer_quote,
            'outcome_metrics'=> $this->outcome_metrics,
            // Context
            'duration_weeks' => $this->duration_weeks,
            'team_size'      => $this->team_size,
            // Metrics from Core
            'metrics' => $this->whenLoaded('metrics', fn() => [
                'views'  => $this->metrics?->views ?? 0,
                'shares' => $this->metrics?->shares ?? 0,
            ]),
            // Taxonomy via Core
            'industries'   => $this->whenLoaded('terms', fn() =>
                $this->termsByTaxonomy('industry')->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug,
                ])
            ),
            'technologies' => $this->whenLoaded('terms', fn() =>
                $this->termsByTaxonomy('technology')->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug, 'icon' => $t->icon,
                ])
            ),
        ]);
    }
}
