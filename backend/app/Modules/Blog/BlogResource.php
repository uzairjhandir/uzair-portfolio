<?php

namespace App\Modules\Blog;

use App\Http\Resources\AbstractContentResource;
use Illuminate\Http\Request;

/**
 * Blog API resource.
 * Extends AbstractContentResource — standard fields (uuid, title, slug, seo, author, etc.)
 * are already included. Only Blog-specific fields are added here.
 */
class BlogResource extends AbstractContentResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            // Blog-specific fields
            'reading_time' => $this->reading_time,
            'is_featured'  => $this->is_featured,
            'is_pinned'    => $this->is_pinned,
            'series'       => $this->whenLoaded('series', fn() => [
                'uuid'  => $this->series->uuid,
                'title' => $this->series->title,
                'slug'  => $this->series->slug,
            ]),
            'categories' => $this->whenLoaded('terms', fn() =>
                $this->termsByTaxonomy('category')->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug,
                ])
            ),
            'tags' => $this->whenLoaded('terms', fn() =>
                $this->termsByTaxonomy('tag')->map(fn($t) => [
                    'uuid' => $t->uuid, 'name' => $t->name, 'slug' => $t->slug,
                ])
            ),
        ]);
    }
}
