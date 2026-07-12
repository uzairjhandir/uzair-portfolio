<?php

namespace App\Modules\CaseStudy;

use App\Http\Resources\AbstractContentResource;
use App\Http\Resources\MediaResource;
use Illuminate\Http\Request;

class CaseStudyResource extends AbstractContentResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            // featuredImage() is a to-many pivot relation (see HasContentMedia); take
            // the first item of the eager-loaded collection rather than the base
            // resource's whenLoaded('featuredImage') handling (which assumes singular).
            'featured_image' => $this->whenLoaded('featuredImage', fn() =>
                ($img = $this->featuredImage->first()) ? new MediaResource($img) : null
            ),
            'gallery' => $this->whenLoaded('gallery', fn() => MediaResource::collection($this->gallery)),
            // Portfolio link
            'portfolio' => $this->whenLoaded('portfolio', fn() => $this->portfolio ? [
                'uuid'  => $this->portfolio->uuid,
                'title' => $this->portfolio->title,
                'slug'  => $this->portfolio->slug,
            ] : null),
            'is_primary'   => $this->is_primary,
            'is_featured'  => $this->is_featured,
            // Narrative sections
            'challenge'      => $this->challenge,
            'solution'       => $this->solution,
            'implementation' => $this->implementation,
            'results'        => $this->results,
            'customer_quote' => $this->customer_quote,
            // Generic label/value metrics list — no dedicated Lighthouse/Performance/
            // SEO/Accessibility/Load-Time columns exist; this JSON array is the only
            // backend-supported way to record quantitative outcomes.
            'outcome_metrics'=> $this->outcome_metrics,
            // Context
            'duration_weeks' => $this->duration_weeks,
            'team_size'      => $this->team_size,
            // Metrics from Core
            'metrics' => $this->whenLoaded('metrics', fn() => [
                'views'  => $this->metrics?->views ?? 0,
                'shares' => $this->metrics?->shares ?? 0,
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
        ]);
    }
}
