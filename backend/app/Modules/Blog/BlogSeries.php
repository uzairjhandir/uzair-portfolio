<?php

namespace App\Modules\Blog;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BlogSeries extends Model
{
    use HasUuids;

    protected $table = 'blog_series';

    protected $fillable = [
        'title', 'slug', 'description',
        'featured_image_id', 'status', 'sort_order', 'created_by',
    ];

    public function posts()
    {
        return $this->hasMany(Blog::class, 'blog_series_id')->orderBy('publish_at');
    }

    public function featuredImage()
    {
        return $this->belongsTo(\App\Models\Media::class, 'featured_image_id');
    }
}
