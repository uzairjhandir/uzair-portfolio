<?php

namespace App\Core\Taxonomy\Services;

use App\Core\Taxonomy\Models\Taxonomy;
use App\Core\Taxonomy\Models\TaxonomyTerm;

class TaxonomyService
{
    public function createTaxonomy(array $data): Taxonomy
    {
        return Taxonomy::create($data);
    }

    public function createTerm(Taxonomy $taxonomy, array $data): TaxonomyTerm
    {
        return $taxonomy->terms()->create($data);
    }

    public function getTermsTree(Taxonomy $taxonomy): \Illuminate\Database\Eloquent\Collection
    {
        return $taxonomy->rootTerms()->with('children.children')->get();
    }
}
