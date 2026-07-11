<?php

namespace App\Interfaces;

use App\Models\MediaFolder;
use Illuminate\Database\Eloquent\Collection;

interface MediaFolderRepositoryInterface
{
    public function getTree(): Collection;
    
    public function findByUuid(string $uuid): ?MediaFolder;
    
    public function createFolder(array $data): MediaFolder;
    
    public function updateFolder(MediaFolder $folder, array $data): bool;
    
    public function deleteFolder(MediaFolder $folder): bool;
}
