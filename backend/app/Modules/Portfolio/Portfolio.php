<?php

namespace App\Modules\Portfolio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Core\Content\Concerns\HasContentSeo;
use App\Core\Content\Concerns\HasContentPublishing;
use App\Core\Content\Concerns\HasContentScheduling;
use App\Core\Content\Concerns\HasContentSlug;
use App\Core\Content\Concerns\HasContentRevisions;
use App\Core\Content\Concerns\HasContentMedia;
use App\Core\Content\Concerns\HasContentSearch;
use App\Core\Content\Concerns\HasContentLocking;
use App\Core\Content\Concerns\HasContentMetrics;
use App\Core\Content\Concerns\HasTaxonomy;
use App\Models\Concerns\HasPreviewToken;

class Portfolio extends Model
{
    use HasUuids, SoftDeletes;

    // Core traits — exact same composition as Blog
    use HasContentSeo;
    use HasContentPublishing;
    use HasContentScheduling;
    use HasContentSlug;
    use HasContentRevisions;
    use HasContentMedia;
    use HasContentSearch;
    use HasContentLocking;
    use HasContentMetrics;
    use HasTaxonomy;
    use HasPreviewToken;

    protected $table = 'portfolios';

    protected $fillable = [
        // Core fields
        'title', 'slug', 'excerpt', 'content', 'status', 'preview_token',
        'author_id', 'reviewer_id', 'publisher_id',
        'publish_at', 'expire_at',
        'checked_out_by', 'checked_out_at', 'lock_reason', 'lock_token', 'heartbeat_at',
        'is_searchable', 'view_count',
        'created_by', 'updated_by',
        // Portfolio-specific
        'client_name', 'project_url', 'repository_url',
        'completion_date', 'is_featured', 'is_open_source', 'project_status',
    ];

    protected $casts = [
        'is_featured'     => 'boolean',
        'is_open_source'  => 'boolean',
        'is_searchable'   => 'boolean',
        'completion_date' => 'date',
        'publish_at'      => 'datetime',
        'expire_at'       => 'datetime',
        'checked_out_at'  => 'datetime',
        'heartbeat_at'    => 'datetime',
    ];

    // -------------------------------------------------------------------------
    // Portfolio-specific relationships ONLY
    // -------------------------------------------------------------------------

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }

    /**
     * Portfolio → Case Studies (hasMany).
     * A project can have multiple stories over time:
     * Initial Build → Migration → Performance → v2 Rewrite.
     * Use is_primary on CaseStudy to designate the canonical story.
     */
    public function caseStudies()
    {
        return $this->hasMany(\App\Modules\CaseStudy\CaseStudy::class, 'portfolio_id');
    }

    public function primaryCaseStudy()
    {
        return $this->hasOne(\App\Modules\CaseStudy\CaseStudy::class, 'portfolio_id')
            ->where('is_primary', true);
    }

    /** Featured portfolios ordered by completion date */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('status', 'published');
    }

    public function scopeOpenSource($query)
    {
        return $query->where('is_open_source', true)->where('status', 'published');
    }
}
