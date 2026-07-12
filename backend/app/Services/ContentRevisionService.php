<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;

/**
 * Centralized revision engine. Works with any model using HasContentRevisions.
 */
class ContentRevisionService
{
    public function snapshot(Model $content, string $comment = 'Auto-snapshot'): void
    {
        if (!method_exists($content, 'createRevision')) {
            return;
        }
        $content->createRevision($comment);
    }

    public function restore(Model $content, string $version): void
    {
        if (!method_exists($content, 'restoreRevision')) {
            return;
        }
        $this->snapshot($content, "Pre-restore snapshot before reverting to {$version}");
        $content->restoreRevision($version);
    }

    public function listVersions(Model $content): array
    {
        return $content->revisions()
            ->select('version', 'comment', 'created_by', 'created_at')
            ->get()
            ->toArray();
    }

    /**
     * Compare two revisions and return a structured diff.
     * React Admin can use this to render Added/Removed/Modified like GitHub.
     */
    public function compare(Model $content, string $versionA, string $versionB): array
    {
        $snapshotA = $content->revisions()->where('version', $versionA)->firstOrFail()->snapshot;
        $snapshotB = $content->revisions()->where('version', $versionB)->firstOrFail()->snapshot;

        $added    = array_diff_key($snapshotB, $snapshotA);
        $removed  = array_diff_key($snapshotA, $snapshotB);
        $modified = [];

        foreach (array_intersect_key($snapshotA, $snapshotB) as $key => $valA) {
            $valB = $snapshotB[$key];
            if ($valA !== $valB) {
                $modified[$key] = ['from' => $valA, 'to' => $valB];
            }
        }

        return compact('added', 'removed', 'modified');
    }
}
