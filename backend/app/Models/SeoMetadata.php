<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoMetadata extends Model
{
    protected $table = 'seo_metadata';

    protected $fillable = [
        'seoable_type',
        'seoable_id',
        'title',
        'description',
        'canonical_url',
        'robots',
        'focus_keyword',
        'og_title',
        'og_description',
        'og_image_id',
        'og_type',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image_id',
        'schema_markup',
        'schema_type',
        'hreflang',
        'seo_score',
        'last_audited_at',
    ];

    protected $casts = [
        'schema_markup' => 'array',
        'hreflang' => 'array',
        'last_audited_at' => 'datetime',
    ];

    public function seoable()
    {
        return $this->morphTo();
    }

    public function ogImage()
    {
        return $this->belongsTo(Media::class, 'og_image_id');
    }

    public function twitterImage()
    {
        return $this->belongsTo(Media::class, 'twitter_image_id');
    }
}
