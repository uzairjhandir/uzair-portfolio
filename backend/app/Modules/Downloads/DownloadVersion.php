<?php

namespace App\Modules\Downloads;

use Illuminate\Database\Eloquent\Model;

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
