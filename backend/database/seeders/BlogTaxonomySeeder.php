<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Core\Taxonomy\Models\Taxonomy;

/**
 * Seeds the universal taxonomies required by the Blog module.
 * Categories and Tags are generic — Portfolio and CaseStudy will reuse them too.
 */
class BlogTaxonomySeeder extends Seeder
{
    public function run(): void
    {
        // Blog Category (hierarchical — e.g. Tech > Frontend)
        Taxonomy::firstOrCreate(['slug' => 'category'], [
            'name'                 => 'Category',
            'description'         => 'Hierarchical blog categories',
            'is_hierarchical'     => true,
            'is_required'         => true,
            'allowed_content_types' => ['blog', 'portfolio', 'case_study'],
        ]);

        // Blog Tag (flat — e.g. Laravel, Vue, Design)
        Taxonomy::firstOrCreate(['slug' => 'tag'], [
            'name'                 => 'Tag',
            'description'         => 'Flat content tags',
            'is_hierarchical'     => false,
            'is_required'         => false,
            'allowed_content_types' => ['blog', 'portfolio', 'case_study'],
        ]);

        // Technology (used by Portfolio and Case Study)
        Taxonomy::firstOrCreate(['slug' => 'technology'], [
            'name'                 => 'Technology',
            'description'         => 'Technologies and frameworks used in a project',
            'is_hierarchical'     => false,
            'is_required'         => false,
            'allowed_content_types' => ['portfolio', 'case_study'],
        ]);

        // Industry
        Taxonomy::firstOrCreate(['slug' => 'industry'], [
            'name'                 => 'Industry',
            'description'         => 'Industry vertical',
            'is_hierarchical'     => false,
            'is_required'         => false,
            'allowed_content_types' => ['portfolio', 'case_study', 'blog'],
        ]);
    }
}
