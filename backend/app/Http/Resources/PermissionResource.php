<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'module' => explode('.', $this->name)[0] ?? null,
            'action' => explode('.', $this->name)[1] ?? null,
            'name' => $this->name,
            'label' => $this->label,
            'description' => $this->description,
        ];
    }
}
