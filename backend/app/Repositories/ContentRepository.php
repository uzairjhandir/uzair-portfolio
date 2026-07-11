<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Base content repository. All content-specific repositories extend this.
 * Blog, Portfolio, and Case Study repositories only add what is truly unique.
 */
class ContentRepository
{
    public function __construct(
        protected string $modelClass
    ) {}

    public function findByUuid(string $uuid): Model
    {
        return $this->modelClass::where('uuid', $uuid)->firstOrFail();
    }

    public function findBySlug(string $slug): Model
    {
        return $this->modelClass::where('slug', $slug)->firstOrFail();
    }

    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->modelClass::query();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', "%{$filters['search']}%");
        }

        return $query->latest()->paginate($perPage);
    }

    public function duplicate(Model $content): Model
    {
        return $this->duplicateWithOptions($content, 'as_draft');
    }

    /**
     * @param string $mode  'as_draft' | 'as_template' | 'with_media' | 'without_media'
     */
    public function duplicateWithOptions(Model $content, string $mode = 'as_draft'): Model
    {
        $clone = $content->replicate();
        $clone->slug = $content->slug . '-copy-' . time();
        $clone->status = \App\Enums\ContentStatusEnum::DRAFT->value;
        $clone->preview_token = null;
        $clone->checked_out_by = null;
        $clone->checked_out_at = null;

        if ($mode === 'as_template') {
            $clone->is_template = true;
        }

        // Localized clone — resets locale-specific fields but keeps structure
        if ($mode === 'clone_localized') {
            $clone->title   = $content->title . ' [Localized Copy]';
            $clone->content = null;
            $clone->excerpt = null;
            // Future: $clone->locale = $targetLocale;
        }

        $clone->save();

        // Copy media collections unless mode is 'without_media'
        if ($mode !== 'without_media' && method_exists($content, 'mediaCollection')) {
            foreach (['featured', 'gallery', 'attachments'] as $collection) {
                $mediaIds = $content->mediaCollection($collection)->pluck('id');
                if ($mediaIds->isNotEmpty()) {
                    $pivotData = $mediaIds->mapWithKeys(fn($id, $i) => [$id => ['collection' => $collection, 'sort_order' => $i]]);
                    $clone->morphToMany(\App\Models\Media::class, 'mediable', 'content_media')->attach($pivotData);
                }
            }
        }

        event(new \App\Events\ContentDuplicated($clone));
        return $clone;
    }

    public function listVersions(Model $content): array
    {
        return $content->revisions()
            ->select('version', 'comment', 'created_by', 'created_at')
            ->get()
            ->toArray();
    }
}
