<?php

namespace App\Models\Concerns;

use App\Models\ContentRevision;

/**
 * Provides Git-like revision history to any content model.
 */
trait HasContentRevisions
{
    public static function bootHasContentRevisions(): void
    {
        // Automatically snapshot on every save
        static::saved(function ($model) {
            $model->createRevision('Auto-snapshot on save');
        });
    }

    public function revisions()
    {
        return $this->morphMany(ContentRevision::class, 'revisable')
            ->orderByDesc('created_at');
    }

    public function createRevision(string $comment = ''): ContentRevision
    {
        return $this->revisions()->create([
            'version' => 'v' . time(),
            'comment' => $comment,
            'snapshot' => $this->toArray(),
            'created_by' => auth()->id(),
        ]);
    }

    public function restoreRevision(string $version): void
    {
        $revision = $this->revisions()->where('version', $version)->firstOrFail();
        $snapshot = $revision->snapshot;
        
        // Remove non-fillable fields before restoring
        unset($snapshot['id'], $snapshot['created_at'], $snapshot['updated_at']);
        
        $this->update($snapshot);
    }
}
