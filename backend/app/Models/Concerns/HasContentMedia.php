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

    /**
     * The "featured" media collection (normally 0-1 items).
     *
     * Returns the relation itself (not ->first()) so it is eager-loadable —
     * calling ->first() here would execute the query immediately and return
     * Model|null, which Eloquent's eager-loader cannot work with ("must
     * return a relationship instance"). Callers that need the single
     * featured image should eager-load 'featuredImage' and then call
     * ->first() on the loaded collection, e.g.:
     *   $model->load('featuredImage');
     *   $model->featuredImage->first();
     * (Content types that need a true singular relation — e.g. Blog, via a
     * dedicated featured_image_id column — should override this method
     * with their own belongsTo() instead of relying on this trait.)
     */
    public function featuredImage()
    {
        return $this->mediaCollection('featured');
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
