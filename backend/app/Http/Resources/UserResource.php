<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid, // Expose UUID as the primary identifier
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'phone' => $this->phone,
            'job_title' => $this->job_title,
            'bio' => $this->bio,
            'social_links' => $this->social_links,
            'website' => $this->website,
            'profile_visibility' => $this->profile_visibility,
            'timezone' => $this->timezone,
            'locale' => $this->locale,
            'status' => $this->status,
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            // 'roles' => RoleResource::collection($this->whenLoaded('roles')),
        ];
    }
}
