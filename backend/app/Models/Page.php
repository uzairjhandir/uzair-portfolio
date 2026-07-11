<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'parent_id',
        'title',
        'slug',
        'breadcrumb_title',
        'excerpt',
        'content',
        'blocks',
        'template',
        'layout',
        'type',
        'status',
        'visibility',
        'password',
        'publish_date',
        'expire_date',
        'sort_order',
        'preview_token',
        'featured_image_id',
        'banner_id',
        'og_image_id',
        'author_id',
        'reviewer_id',
        'publisher_id',
        'sitemap_priority',
        'sitemap_change_frequency',
        'sitemap_last_modified',
        'show_in_header',
        'show_in_footer',
        'show_in_sitemap',
        'show_in_search',
        'show_in_breadcrumb',
        'navigation_menu',
        'navigation_order',
        'navigation_icon',
        'navigation_badge',
        'layout_settings',
        'locked_by',
        'locked_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'blocks' => 'json',
        'layout_settings' => 'json',
        'publish_date' => 'datetime',
        'expire_date' => 'datetime',
        'locked_at' => 'datetime',
        'sitemap_last_modified' => 'datetime',
        'show_in_header' => 'boolean',
        'show_in_footer' => 'boolean',
        'show_in_sitemap' => 'boolean',
        'show_in_search' => 'boolean',
        'show_in_breadcrumb' => 'boolean',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function parent()
    {
        return $this->belongsTo(Page::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Page::class, 'parent_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function publisher()
    {
        return $this->belongsTo(User::class, 'publisher_id');
    }

    public function featuredImage()
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    public function banner()
    {
        return $this->belongsTo(Media::class, 'banner_id');
    }

    public function ogImage()
    {
        return $this->belongsTo(Media::class, 'og_image_id');
    }

    public function revisions()
    {
        return $this->hasMany(PageRevision::class)->orderBy('created_at', 'desc');
    }

    public function lockedBy()
    {
        return $this->belongsTo(User::class, 'locked_by');
    }

    public function isLocked(): bool
    {
        if (!$this->locked_at || !$this->locked_by) {
            return false;
        }
        // Lock expires after 30 minutes of inactivity
        return $this->locked_at->copy()->addMinutes(30)->isFuture();
    }

    public function lockForUser(User $user): void
    {
        $this->update([
            'locked_by' => $user->id,
            'locked_at' => now(),
        ]);
    }

    public function releaseLock(): void
    {
        $this->update([
            'locked_by' => null,
            'locked_at' => null,
        ]);
    }
}
