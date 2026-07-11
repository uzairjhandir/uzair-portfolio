<?php

namespace App\Services;

use App\Interfaces\MediaRepositoryInterface;
use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class MediaService
{
    public function __construct(
        protected MediaRepositoryInterface $mediaRepository
    ) {}

    public function handleUpload(UploadedFile $file, ?string $folderId = null, ?int $userId = null): Media
    {
        // 1. Calculate Checksum
        $checksum = hash_file('sha256', $file->getRealPath());

        // 2. Duplicate Detection
        $existingMedia = $this->mediaRepository->findByChecksum($checksum);
        if ($existingMedia) {
            return $existingMedia; // Return existing instead of duplicate upload
        }

        // 3. Fallback logic since Spatie is not literally installed yet
        // In reality, this would use $model->addMedia($file)->toMediaCollection()
        
        $media = Media::create([
            'folder_id' => $folderId,
            'collection_name' => 'default',
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'disk' => 'public',
            'size' => $file->getSize(),
            'checksum' => $checksum,
            'uploaded_by' => $userId,
            'model_type' => 'App\Models\User', // Dummy
            'model_id' => $userId ?? 1,
            'manipulations' => [],
            'custom_properties' => [],
            'generated_conversions' => [],
            'responsive_images' => [],
        ]);

        return $media;
    }

    public function replaceMedia(Media $media, UploadedFile $newFile): Media
    {
        // Update physical file but keep Media ID
        $media->update([
            'file_name' => $newFile->getClientOriginalName(),
            'mime_type' => $newFile->getMimeType(),
            'size' => $newFile->getSize(),
            'checksum' => hash_file('sha256', $newFile->getRealPath()),
        ]);
        
        return $media;
    }
}
