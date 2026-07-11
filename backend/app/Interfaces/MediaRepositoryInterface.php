<?php

namespace App\Interfaces;

use App\Models\Media;
use Illuminate\Pagination\LengthAwarePaginator;

interface MediaRepositoryInterface
{
    public function search(array $filters, int $perPage = 20): LengthAwarePaginator;
    
    public function findByChecksum(string $checksum): ?Media;
    
    public function findByUuid(string $uuid): ?Media;
    
    public function updateMetadata(Media $media, array $metadata): bool;
    
    public function moveBulk(array $mediaUuids, ?string $folderUuid): bool;
    
    public function deleteBulk(array $mediaUuids): bool;
}
