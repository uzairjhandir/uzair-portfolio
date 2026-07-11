<?php

namespace App\Modules\Downloads;

use App\Http\Resources\AbstractContentResource;
use Illuminate\Http\Request;

class DownloadResource extends AbstractContentResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'latest_version'        => $this->latest_version,
            'is_featured'           => $this->is_featured,
            'requires_email'        => $this->requires_email,
            'requires_accept_terms' => $this->requires_accept_terms,
            'requires_agreement'    => $this->requires_agreement,
            'license_type'          => $this->license_type,
            'access_level'          => $this->access_level,
            'download_count'        => $this->download_count,
            'media'                 => $this->whenLoaded('media', fn() => [
                'uuid'      => $this->media->uuid,
                'filename'  => $this->media->filename,
                'mime_type' => $this->media->mime_type,
                'size'      => $this->media->size,
                'url'       => $this->media->url,
            ]),
            'preview_media'         => $this->whenLoaded('previewMedia', fn() => [
                'uuid'      => $this->previewMedia->uuid,
                'url'       => $this->previewMedia->url,
            ]),
            'metrics' => $this->whenLoaded('metrics', fn() => [
                'views'     => $this->metrics?->views ?? 0,
                'downloads' => $this->metrics?->downloads ?? 0,
            ]),
        ]);
    }
}
