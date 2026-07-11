<?php

namespace App\Models\Concerns;

use App\Models\Media;

/**
 * Provides Media Library collections to any content model.
 * Uses a polymorphic many-to-many approach via Media collections.
 * No foreign key columns needed on the content table itself.
 */
trait HasContentMedia
{
    /**
     * Returns media items filtered by collection name.
     */
    public function mediaCollection(string $collection)
    {
        return $this->morphToMany(Media::class, 'mediable', 'content_media')
            ->wherePivot('collection', $collection)
            ->withPivot('sort_order', 'collection');
    }

    public function featuredImage()
    {
        return $this->mediaCollection('featured')->first();
    }

    public function gallery()
    {
        return $this->mediaCollection('gallery');
    }

    public function attachments()
    {
        return $this->mediaCollection('attachments');
    }

    public function syncMedia(string $collection, array $mediaUuids): void
    {
        // Resolve UUIDs to IDs and sync
        $ids = Media::whereIn('uuid', $mediaUuids)->pluck('id');
        $pivotData = $ids->mapWithKeys(fn($id, $i) => [$id => ['collection' => $collection, 'sort_order' => $i]]);
        
        $this->morphToMany(Media::class, 'mediable', 'content_media')
            ->wherePivot('collection', $collection)
            ->sync($pivotData);
    }
}
