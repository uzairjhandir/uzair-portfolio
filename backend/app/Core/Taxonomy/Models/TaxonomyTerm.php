<?php

namespace App\Core\Taxonomy\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TaxonomyTerm extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'taxonomy_id', 'parent_id', 'name', 'slug',
        'description', 'featured_image_id', 'color', 'icon',
        'sort_order', 'status', 'seo_metadata_id', 'metadata', 'count',
    ];

    protected $casts = [
        'metadata' => 'json',
        'count' => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function taxonomy()
    {
        return $this->belongsTo(Taxonomy::class);
    }

    public function parent()
    {
        return $this->belongsTo(TaxonomyTerm::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(TaxonomyTerm::class, 'parent_id')->orderBy('sort_order');
    }

    public function ancestors()
    {
        return $this->parent ? collect([$this->parent])->merge($this->parent->ancestors()) : collect();
    }

    public function featuredImage()
    {
        return $this->belongsTo(\App\Models\Media::class, 'featured_image_id');
    }

    public function seo()
    {
        return $this->belongsTo(\App\Models\SeoMetadata::class, 'seo_metadata_id');
    }

    /**
     * Raw pivot rows attaching this term to any content type (polymorphic,
     * no dedicated model — used only to recompute the cached `count`).
     */
    public function termables()
    {
        return \Illuminate\Support\Facades\DB::table('taxonomy_termables')
            ->where('taxonomy_term_id', $this->id);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function incrementCount(): void
    {
        $this->increment('count');
    }

    public function decrementCount(): void
    {
        $this->decrement('count');
    }
}
