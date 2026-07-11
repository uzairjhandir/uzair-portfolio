<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->name,
            'file_name' => $this->file_name,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            
            // URLs and Conversions
            'original_url' => $this->getUrl(),
            'preview_url' => $this->getUrl('preview'), // assuming preview conversion
            'conversions' => $this->generated_conversions,
            
            // Metadata
            'alt_text' => $this->alt_text,
            'caption' => $this->caption,
            'title' => $this->title,
            'description' => $this->description,
            'credits' => $this->credits,
            'license' => $this->license,
            
            // UI specific
            'focal_point' => $this->focal_point,
            'dominant_color' => $this->dominant_color,
            'blur_placeholder' => $this->blur_placeholder,
            'width' => $this->width,
            'height' => $this->height,
            'duration' => $this->duration,
            
            'status' => $this->status,
            'visibility' => $this->visibility,
            'checksum' => $this->checksum,
            
            'folder' => new MediaFolderResource($this->whenLoaded('folder')),
            
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    // Stub for missing Spatie method
    private function getUrl($conversion = '')
    {
        return env('APP_URL') . '/storage/' . $this->id . '/' . ($conversion ? $conversion . '-' : '') . $this->file_name;
    }
}
