<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'key' => $this->key,
            'value' => $this->value, // Value attribute handles decryption and ENV overrides
            'default_value' => $this->default_value,
            'type' => $this->type,
            'validation' => $this->validation,
            'is_public' => $this->is_public,
            'is_encrypted' => $this->is_encrypted,
            'is_system' => $this->is_system,
        ];
    }
}
