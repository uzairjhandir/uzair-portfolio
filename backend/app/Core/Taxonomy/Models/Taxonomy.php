<?php

namespace App\Core\Taxonomy\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Taxonomy extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $fillable = [
        'name', 'slug', 'description',
        'is_hierarchical', 'is_required',
        'allowed_content_types', 'sort_order',
    ];

    protected $casts = [
        'is_hierarchical' => 'boolean',
        'is_required' => 'boolean',
        'allowed_content_types' => 'json',
    ];

    public function terms()
    {
        return $this->hasMany(TaxonomyTerm::class)->orderBy('sort_order');
    }

    public function rootTerms()
    {
        return $this->terms()->whereNull('parent_id');
    }
}
