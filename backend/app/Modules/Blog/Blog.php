<?php

namespace App\Modules\Blog;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

// Core Content Engine traits — composed, not inherited
use App\Core\Content\Concerns\HasContentSeo;
use App\Core\Content\Concerns\HasContentPublishing;
use App\Core\Content\Concerns\HasContentScheduling;
use App\Core\Content\Concerns\HasContentSlug;
use App\Core\Content\Concerns\HasContentRevisions;
use App\Core\Content\Concerns\HasContentMedia;
use App\Core\Content\Concerns\HasContentSearch;
use App\Core\Content\Concerns\HasContentLocking;
use App\Core\Content\Concerns\HasTaxonomy;
use App\Models\Concerns\HasPreviewToken;
use App\Modules\Search\Contracts\SearchableResource;

class Blog extends Model implements SearchableResource
{
    use HasUuids, SoftDeletes;

    // Core traits — 9 capabilities, zero duplication
    use HasContentSeo;
    use HasContentPublishing;
    use HasContentScheduling;
    use HasContentSlug;
    use HasContentRevisions;
    use HasContentMedia;
    use HasContentSearch;
    use HasContentLocking;
    use HasTaxonomy;
    use HasPreviewToken;

    protected $table = 'blogs';

    protected $fillable = [
        // Core fields
        'title', 'slug', 'excerpt', 'content', 'status', 'preview_token',
        'author_id', 'reviewer_id', 'publisher_id',
        'publish_at', 'expire_at',
        'checked_out_by', 'checked_out_at', 'lock_reason', 'lock_token', 'heartbeat_at',
        'is_searchable', 'view_count',
        'created_by', 'updated_by',
        // Blog-specific
        'blog_series_id', 'reading_time', 'is_featured', 'is_pinned',
    ];

    protected $casts = [
        'is_featured'    => 'boolean',
        'is_pinned'      => 'boolean',
        'is_searchable'  => 'boolean',
        'publish_at'     => 'datetime',
        'expire_at'      => 'datetime',
        'checked_out_at' => 'datetime',
        'heartbeat_at'   => 'datetime',
    ];

    // -------------------------------------------------------------------------
    // Blog-specific relationships ONLY
    // Everything else (SEO, revisions, media, etc.) comes from Core traits
    // -------------------------------------------------------------------------

    public function series()
    {
        return $this->belongsTo(BlogSeries::class, 'blog_series_id');
    }

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }

    public function relatedPosts()
    {
        // Related = same taxonomy terms, exclude self, published only
        $termIds = $this->terms()->pluck('taxonomy_terms.id');

        return static::where('id', '!=', $this->id)
            ->where('status', 'published')
            ->whereHas('terms', fn($q) => $q->whereIn('taxonomy_terms.id', $termIds))
            ->limit(4)
            ->get();
    }

    public function nextPost(): ?self
    {
        return static::where('status', 'published')
            ->where('publish_at', '>', $this->publish_at)
            ->orderBy('publish_at')
            ->first();
    }

    public function previousPost(): ?self
    {
        return static::where('status', 'published')
            ->where('publish_at', '<', $this->publish_at)
            ->orderByDesc('publish_at')
            ->first();
    }

    // -------------------------------------------------------------------------
    // Blog-specific hooks (called by ContentPublishingService lifecycle)
    // -------------------------------------------------------------------------

    public function beforePublish(): void
    {
        // Recalculate reading time just before publish
        if ($this->content) {
            $wordCount = str_word_count(strip_tags($this->content));
            $this->update(['reading_time' => (int) ceil($wordCount / 200)]);
        }
    }
}
