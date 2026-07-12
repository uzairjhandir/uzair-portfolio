<?php

namespace App\Modules\Downloads;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

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
