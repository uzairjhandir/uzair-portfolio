<?php

namespace App\Modules\Downloads;

use Illuminate\Database\Eloquent\Model;

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
