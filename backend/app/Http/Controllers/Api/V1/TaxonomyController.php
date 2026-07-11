<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Core\Taxonomy\Models\Taxonomy;
use App\Core\Taxonomy\Models\TaxonomyTerm;
use App\Core\Taxonomy\Services\TaxonomyService;
use Illuminate\Http\Request;

/**
 * Universal taxonomy controller.
 * Blog, Portfolio, and Pages do NOT create their own category controllers.
 * Everything flows through here.
 */
class TaxonomyController extends Controller
{
    public function __construct(private TaxonomyService $service) {}

    public function index()
    {
        return response()->json(Taxonomy::with('rootTerms')->get());
    }

    public function show(string $uuid)
    {
        $taxonomy = Taxonomy::where('uuid', $uuid)->firstOrFail();
        return response()->json($taxonomy->load('terms'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:taxonomies,slug',
            'is_hierarchical' => 'boolean',
            'allowed_content_types' => 'nullable|array',
        ]);
        return response()->json($this->service->createTaxonomy($data), 201);
    }

    public function terms(string $uuid)
    {
        $taxonomy = Taxonomy::where('uuid', $uuid)->firstOrFail();
        return response()->json($this->service->getTermsTree($taxonomy));
    }

    public function storeTerm(Request $request, string $uuid)
    {
        $taxonomy = Taxonomy::where('uuid', $uuid)->firstOrFail();
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:taxonomy_terms,slug',
            'parent_id' => 'nullable|exists:taxonomy_terms,id',
        ]);
        return response()->json($this->service->createTerm($taxonomy, $data), 201);
    }
}
