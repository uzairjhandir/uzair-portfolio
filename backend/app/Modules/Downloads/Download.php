<?php

namespace App\Modules\Downloads;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

use App\Core\Content\Concerns\HasContentSeo;
use App\Core\Content\Concerns\HasContentPublishing;
use App\Core\Content\Concerns\HasContentScheduling;
use App\Core\Content\Concerns\HasContentSlug;
use App\Core\Content\Concerns\HasContentRevisions;
use App\Core\Content\Concerns\HasContentMedia;
use App\Core\Content\Concerns\HasContentSearch;
use App\Core\Content\Concerns\HasContentLocking;
use App\Core\Content\Concerns\HasContentMetrics;
use App\Core\Content\Concerns\HasContentRelations;
use App\Core\Content\Concerns\HasTaxonomy;
use App\Models\Concerns\HasPreviewToken;
use App\Modules\Search\Contracts\SearchableResource;

class Download extends Model implements SearchableResource
{
    use HasUuids, SoftDeletes;

    // Core traits
    use HasContentSeo, HasContentPublishing, HasContentScheduling, HasContentSlug;
    use HasContentRevisions, HasContentMedia, HasContentSearch, HasContentLocking;
    use HasContentMetrics, HasContentRelations, HasTaxonomy, HasPreviewToken;

    protected $table = 'downloads';

    protected $fillable = [
        'title', 'slug', 'excerpt', 'content', 'status', 'preview_token',
        'author_id', 'reviewer_id', 'publisher_id',
        'publish_at', 'expire_at',
        'checked_out_by', 'checked_out_at', 'lock_reason', 'lock_token', 'heartbeat_at',
        'is_searchable', 'view_count', 'created_by', 'updated_by',
        
        'media_id', 'preview_media_id', 'latest_version',
        'access_level', 'required_permission',
        'requires_email', 'requires_accept_terms', 'requires_agreement',
        'license_type', 'license_key', 'watermark_template', 'checksum',
        'is_featured', 'download_count',
    ];

    protected $casts = [
        'is_featured'           => 'boolean',
        'requires_email'        => 'boolean',
        'requires_accept_terms' => 'boolean',
        'requires_agreement'    => 'boolean',
        'is_searchable'         => 'boolean',
        'publish_at'            => 'datetime',
        'expire_at'             => 'datetime',
        'checked_out_at'        => 'datetime',
        'heartbeat_at'          => 'datetime',
    ];

    // ── Downloads-specific relationships ────────────────────────────────────

    public function media()
    {
        return $this->belongsTo(\App\Models\Media::class, 'media_id');
    }

    public function previewMedia()
    {
        return $this->belongsTo(\App\Models\Media::class, 'preview_media_id');
    }

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'author_id');
    }

    public function versions()
    {
        return $this->hasMany(DownloadVersion::class, 'download_id')->orderByDesc('created_at');
    }

    public function tokens()
    {
        return $this->hasMany(DownloadToken::class, 'download_id');
    }

    public function events()
    {
        return $this->hasMany(DownloadEvent::class, 'download_id');
    }

    // ── Scopes ───────────────────────────────────────────────────────────────

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('status', 'published');
    }

    public function scopePublicAccess($query)
    {
        return $query->where('access_level', 'public')->where('status', 'published');
    }

    // ── Secure download token & Events ───────────────────────────────────────

    public function generateDownloadToken(?int $userId = null, ?string $email = null, ?string $ip = null): DownloadToken
    {
        $token = $this->tokens()->create([
            'user_id'    => $userId,
            'email'      => $email,
            'ip'         => $ip,
            'expires_at' => now()->addMinutes(15),
        ]);

        $this->logEvent('requested', $userId, $token->id);
        
        // Let the system know an event occurred
        event(new \App\Events\DownloadRequested($this, $token));

        return $token;
    }

    public function recordDownload(DownloadToken $token): void
    {
        $this->increment('download_count');
        app(\App\Core\Metrics\ContentMetricsService::class)->incrementDownloads($this);

        $token->update(['downloaded_at' => now()]);
        $this->logEvent('completed', $token->user_id, $token->id);

        event(new \App\Events\DownloadCompleted($this, $token));
    }

    public function logEvent(string $eventType, ?int $userId = null, ?int $tokenId = null, array $metadata = []): void
    {
        $this->events()->create([
            'download_token_id' => $tokenId,
            'user_id'           => $userId,
            'event_type'        => $eventType,
            'country'           => $metadata['country'] ?? null,
            'browser'           => $metadata['browser'] ?? null,
            'device'            => $metadata['device'] ?? null,
            'referrer'          => $metadata['referrer'] ?? null,
            'duration'          => $metadata['duration'] ?? null,
            'occurred_at'       => now(),
        ]);
    }

    // ── SearchableResource Implementation ────────────────────────────────────

    public function toSearchDocument(): array
    {
        return [
            'uuid'            => $this->uuid,
            'searchable_uuid' => $this->uuid,
            'module'          => 'Downloads',
            'locale'          => 'en',
            'title'           => $this->title,
            'summary'         => $this->excerpt,
            'content'         => $this->content,
            'keywords'        => null, // Optional
            'url'             => "/downloads/{$this->slug}", // Frontend URL
            'image'           => $this->previewMedia?->url,
            'status'          => $this->status,
            'visibility'      => $this->access_level === 'public' ? 'public' : 'restricted',
            'published_at'    => $this->publish_at,
            'metadata'        => [
                'file_type'      => $this->media?->mime_type,
                'download_count' => $this->download_count,
            ],
        ];
    }

    public function getSearchType(): string
    {
        return 'download';
    }

    public function isSearchable(): bool
    {
        return $this->status === 'published' && $this->is_searchable;
    }

    public function getSearchBoost(): int
    {
        $boost = 20; // Base boost for downloads
        if ($this->is_featured) $boost += 10;
        return $boost;
    }
}
