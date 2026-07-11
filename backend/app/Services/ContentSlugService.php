<?php

namespace App\Services;

use App\Models\ContentSlugHistory;
use Illuminate\Support\Str;

/**
 * Single place for slug logic across all content types.
 * Records history and creates 301 redirects on slug change.
 */
class ContentSlugService
{
    public function generate(string $title): string
    {
        return Str::slug($title);
    }

    public function ensureUnique(string $slug, string $modelClass, ?int $exceptId = null): string
    {
        $base = $slug;
        $i = 1;

        while (true) {
            $existsInModel = $modelClass::where('slug', $slug)
                ->when($exceptId, fn($q) => $q->where('id', '!=', $exceptId))
                ->exists();

            $existsInHistory = ContentSlugHistory::where('slug', $slug)->exists();

            if (!$existsInModel && !$existsInHistory) {
                break;
            }

            $slug = $base . '-' . $i++;
        }

        return $slug;
    }

    public function recordOldSlug(\Illuminate\Database\Eloquent\Model $model, string $oldSlug): void
    {
        $model->slugHistory()->firstOrCreate(['slug' => $oldSlug]);
    }
}
