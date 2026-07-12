<?php

namespace App\Modules\CaseStudy;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Concerns\HasContentSeo;
use App\Models\Concerns\HasContentPublishing;
use App\Models\Concerns\HasContentScheduling;
use App\Models\Concerns\HasContentSlug;
use App\Models\Concerns\HasContentRevisions;
use App\Models\Concerns\HasContentMedia;
use App\Models\Concerns\HasContentSearch;
use App\Core\Content\Concerns\HasContentLocking;
use App\Core\Content\Concerns\HasContentMetrics;
use App\Core\Content\Concerns\HasContentRelations;
use App\Core\Content\Concerns\HasTaxonomy;
use App\Models\Concerns\HasPreviewToken;
use App\Modules\Search\Contracts\SearchableResource;

class CaseStudy extends Model implements SearchableResource
{
    use HasUuids, SoftDeletes;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    // Core traits — composing the full engine
    use HasContentSeo;
    use HasContentPublishing;
    use HasContentScheduling;
    use HasContentSlug;
    use HasContentRevisions;
    use HasContentMedia;
    use HasContentSearch;
    use HasContentLocking;
    use HasContentMetrics;
    use HasContentRelations; // Powers Blog → CaseStudy, CaseStudy → Documentation, etc.
    use HasTaxonomy;
    use HasPreviewToken;

    protected $table = 'case_studies';

    protected $fillable = [
        // Core
        'title', 'slug', 'excerpt', 'status', 'preview_token',
        'author_id', 'reviewer_id', 'publisher_id',
        'publish_at', 'expire_at',
        'checked_out_by', 'checked_out_at', 'lock_reason', 'lock_token', 'heartbeat_at',
        'is_searchable', 'view_count',
        'created_by', 'updated_by',
        // Case Study-specific
        'portfolio_id', 'is_primary', 'is_featured',
        'challenge', 'solution', 'implementation', 'results',
        'customer_quote', 'outcome_metrics',
        'duration_weeks', 'team_size',
    ];

    protected $casts = [
        'is_primary'      => 'boolean',
        'is_featured'     => 'boolean',
        'is_searchable'   => 'boolean',
        'outcome_metrics' => 'json',
        'publish_at'      => 'datetime',
        'expire_at'       => 'datetime',
        'checked_out_at'  => 'datetime',
        'heartbeat_at'    => 'datetime',
    ];

    // -------------------------------------------------------------------------
    // Case Study-specific relationships ONLY
    // -------------------------------------------------------------------------

    /**
     * The Portfolio project this story is about.
     * A Case Study without a Portfolio is a standalone story (allowed).
     */
    public function portfolio()
    {
        return $this->belongsTo(\App\Modules\Portfolio\Portfolio::class, 'portfolio_id');
    }

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('status', 'published');
    }

    // -------------------------------------------------------------------------
    // SearchableResource
    // -------------------------------------------------------------------------

    public function toSearchDocument(): array
    {
        return [
            'uuid'            => $this->uuid,
            'searchable_uuid' => $this->uuid,
            'module'          => 'CaseStudy',
            'locale'          => 'en',
            'title'           => $this->title,
            'summary'         => $this->excerpt,
            'content'         => trim(implode("\n", array_filter([$this->challenge, $this->solution, $this->implementation, $this->results]))),
            'keywords'        => null,
            'url'             => "/case-studies/{$this->slug}",
            'image'           => $this->featuredImage?->first()?->original_url,
            'status'          => $this->status,
            'visibility'      => 'public',
            'published_at'    => $this->publish_at,
            'metadata'        => [
                'portfolio_uuid' => $this->portfolio?->uuid,
            ],
        ];
    }

    public function getSearchType(): string
    {
        return 'case_study';
    }

    public function isSearchable(): bool
    {
        return $this->status === 'published' && $this->is_searchable;
    }

    public function getSearchBoost(): int
    {
        return $this->is_featured ? 15 : 8;
    }
}
