<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageRevision extends Model
{
    protected $fillable = [
        'page_id',
        'version',
        'change_summary',
        'blocks',
        'content',
        'created_by',
    ];

    protected $casts = [
        'blocks' => 'json',
    ];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
