<?php

namespace App\Repositories;

use App\Interfaces\MediaRepositoryInterface;
use App\Models\Media;
use App\Models\MediaFolder;
use Illuminate\Pagination\LengthAwarePaginator;

class MediaRepository implements MediaRepositoryInterface
{
    public function search(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        $query = Media::query();

        if (isset($filters['folder_uuid'])) {
            $folder = MediaFolder::where('uuid', $filters['folder_uuid'])->first();
            if ($folder) {
                $query->where('folder_id', $folder->id);
            } else {
                $query->whereNull('folder_id'); // Root folder
            }
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('file_name', 'LIKE', "%{$search}%")
                  ->orWhere('alt_text', 'LIKE', "%{$search}%");
            });
        }

        if (!empty($filters['mime_type'])) {
            $query->where('mime_type', 'LIKE', "{$filters['mime_type']}%");
        }

        if (isset($filters['trashed']) && $filters['trashed']) {
            $query->onlyTrashed();
        }

        return $query->latest()->paginate($perPage);
    }
    
    public function findByChecksum(string $checksum): ?Media
    {
        return Media::where('checksum', $checksum)->first();
    }
    
    public function findByUuid(string $uuid): ?Media
    {
        return Media::withTrashed()->where('uuid', $uuid)->first();
    }
    
    public function updateMetadata(Media $media, array $metadata): bool
    {
        return $media->update($metadata);
    }
    
    public function moveBulk(array $mediaUuids, ?string $folderUuid): bool
    {
        $folderId = null;
        if ($folderUuid) {
            $folder = MediaFolder::where('uuid', $folderUuid)->first();
            if ($folder) $folderId = $folder->id;
        }

        return Media::whereIn('uuid', $mediaUuids)->update(['folder_id' => $folderId]) > 0;
    }
    
    public function deleteBulk(array $mediaUuids): bool
    {
        return Media::whereIn('uuid', $mediaUuids)->delete() > 0;
    }
}
