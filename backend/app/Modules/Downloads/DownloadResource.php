<?php

namespace App\Modules\Downloads;

use App\Http\Resources\AbstractContentResource;
use App\Http\Resources\MediaResource;
use Illuminate\Http\Request;

class DownloadResource extends AbstractContentResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'content'                => $this->content,
            'latest_version'         => $this->latest_version,
            'is_featured'            => $this->is_featured,
            'requires_email'         => $this->requires_email,
            'requires_accept_terms'  => $this->requires_accept_terms,
            'requires_agreement'     => $this->requires_agreement,
            'license_type'           => $this->license_type,
            'access_level'           => $this->access_level,
            'download_count'         => $this->download_count,
            // media()/previewMedia() are dedicated belongsTo relations (like Blog's
            // featured_image_id) — properly eager-loadable, unlike the shared
            // HasContentMedia trait's featuredImage()/gallery() pivot relations.
            'file'          => $this->whenLoaded('media', fn() => $this->media ? new MediaResource($this->media) : null),
            'preview_image' => $this->whenLoaded('previewMedia', fn() => $this->previewMedia ? new MediaResource($this->previewMedia) : null),
            // Taxonomy via Core — filter the already-eager-loaded `terms` collection
            // (termsByTaxonomy() returns a Relation query builder, not a Collection).
            'categories' => $this->whenLoaded('terms', fn() =>
                $this->terms->filter(fn($t) => $t->taxonomy?->slug === 'category')->values()->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug,
                ])
            ),
            'metrics' => $this->whenLoaded('metrics', fn() => [
                'views'     => $this->metrics?->views ?? 0,
                'downloads' => $this->metrics?->downloads ?? 0,
            ]),
        ]);
    }
}
