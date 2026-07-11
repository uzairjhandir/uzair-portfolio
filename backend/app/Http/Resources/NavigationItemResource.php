<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NavigationItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'label' => $this->label,
            'type' => $this->type,
            'url' => $this->resolveUrl(),
            'target' => $this->target,
            'rel' => $this->rel,
            'tooltip' => $this->tooltip,
            'css_class' => $this->css_class,
            'badge' => $this->badge,
            'icon' => [
                'type' => $this->icon_type,
                'value' => $this->icon_value,
                'media' => new MediaResource($this->whenLoaded('media')),
            ],
            'visibility' => [
                'type' => $this->visibility,
                'roles' => $this->roles,
                'permissions' => $this->permissions,
            ],
            'children' => NavigationItemResource::collection($this->whenLoaded('children')),
        ];
    }

    private function resolveUrl(): ?string
    {
        if (in_array($this->type, ['page', 'homepage', 'blog', 'portfolio', 'case_study'])) {
            return $this->page ? '/' . $this->page->slug : null;
        }

        return $this->custom_url;
    }
}
