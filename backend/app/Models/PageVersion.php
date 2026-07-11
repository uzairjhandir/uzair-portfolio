<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageVersion extends Model
{
    protected $fillable = [
        'page_id',
        'version',
        'page_snapshot',
        'attached_blocks_snapshot',
        'seo_snapshot',
        'publish_state',
        'created_by',
    ];

    protected $casts = [
        'page_snapshot' => 'json',
        'attached_blocks_snapshot' => 'json',
        'seo_snapshot' => 'json',
    ];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}
