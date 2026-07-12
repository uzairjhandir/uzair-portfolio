<?php

namespace App\Modules\Downloads;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

/**
 * Immutable historical version of a download.
 */
class DownloadVersion extends Model
{
    protected $table = 'download_versions';

    protected $fillable = [
        'download_id', 'media_id', 'version', 'checksum', 'changelog', 'created_by'
    ];

    public function download()
    {
        return $this->belongsTo(Download::class, 'download_id');
    }

    public function media()
    {
        return $this->belongsTo(\App\Models\Media::class, 'media_id');
    }
}

/**
 * Secure token for downloading a file. Replaces simple Cache logic.
 */
class DownloadToken extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $table = 'download_tokens';

    protected $fillable = [
        'download_id', 'user_id', 'email', 'ip',
        'expires_at', 'used_at', 'downloaded_at'
    ];

    protected $casts = [
        'expires_at'    => 'datetime',
        'used_at'       => 'datetime',
        'downloaded_at' => 'datetime',
    ];

    public function download()
    {
        return $this->belongsTo(Download::class, 'download_id');
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}

/**
 * Analytical event tracking for downloads.
 */
class DownloadEvent extends Model
{
    public $timestamps = false;

    protected $table = 'download_events';

    protected $fillable = [
        'download_token_id', 'download_id', 'user_id', 'event_type',
        'country', 'browser', 'device', 'referrer', 'duration', 'occurred_at'
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    public function token()
    {
        return $this->belongsTo(DownloadToken::class, 'download_token_id');
    }

    public function download()
    {
        return $this->belongsTo(Download::class, 'download_id');
    }
}
