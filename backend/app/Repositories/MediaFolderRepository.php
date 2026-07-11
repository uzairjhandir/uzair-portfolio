<?php

namespace App\Repositories;

use App\Interfaces\MediaFolderRepositoryInterface;
use App\Models\MediaFolder;
use Illuminate\Database\Eloquent\Collection;

class MediaFolderRepository implements MediaFolderRepositoryInterface
{
    public function getTree(): Collection
    {
        return MediaFolder::whereNull('parent_id')
            ->with('children')
            ->orderBy('name')
            ->get();
    }
    
    public function findByUuid(string $uuid): ?MediaFolder
    {
        return MediaFolder::where('uuid', $uuid)->first();
    }
    
    public function createFolder(array $data): MediaFolder
    {
        return MediaFolder::create($data);
    }
    
    public function updateFolder(MediaFolder $folder, array $data): bool
    {
        return $folder->update($data);
    }
    
    public function deleteFolder(MediaFolder $folder): bool
    {
        return $folder->delete();
    }
}
