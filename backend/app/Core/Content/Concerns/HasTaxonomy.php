<?php

namespace App\Core\Content\Concerns;

use App\Core\Taxonomy\Models\TaxonomyTerm;

/**
 * Provides universal taxonomy support to any content model.
 * Blog gets Categories & Tags, Portfolio gets Technologies & Industries,
 * all using the exact same system.
 *
 * Usage: add `use HasTaxonomy;` to Blog, Portfolio, CaseStudy, etc.
 */
trait HasTaxonomy
{
    public function terms()
    {
        return $this->morphToMany(TaxonomyTerm::class, 'termable', 'taxonomy_termables')
            ->withPivot('sort_order')
            ->with('taxonomy')
            ->orderBy('sort_order');
    }

    /**
     * Get all terms filtered by taxonomy slug.
     * Example: $blog->termsByTaxonomy('category')
     */
    public function termsByTaxonomy(string $taxonomySlug)
    {
        return $this->terms()->whereHas('taxonomy', fn($q) => $q->where('slug', $taxonomySlug));
    }

    /**
     * Sync terms for a specific taxonomy without touching other taxonomies.
     * Example: $blog->syncTerms('tag', ['laravel-uuid', 'vue-uuid'])
     */
    public function syncTerms(string $taxonomySlug, array $termUuids): void
    {
        $ids = TaxonomyTerm::whereIn('uuid', $termUuids)
            ->whereHas('taxonomy', fn($q) => $q->where('slug', $taxonomySlug))
            ->pluck('id');

        // Detach only this taxonomy's existing terms, then attach new ones
        $existing = $this->terms()
            ->whereHas('taxonomy', fn($q) => $q->where('slug', $taxonomySlug))
            ->pluck('taxonomy_terms.id');

        $this->terms()->detach($existing);
        $this->terms()->attach($ids->mapWithKeys(fn($id, $i) => [$id => ['sort_order' => $i]]));

        // Update cached count on terms
        TaxonomyTerm::whereIn('id', $ids->merge($existing))
            ->each(fn($term) => $term->update(['count' => $term->termables()->count()]));
    }
}
