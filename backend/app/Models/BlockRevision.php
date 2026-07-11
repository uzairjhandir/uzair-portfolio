<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockRevision extends Model
{
    protected $fillable = [
        'block_id',
        'version',
        'comment',
        'content_snapshot',
        'settings_snapshot',
        'status',
        'created_by',
    ];

    protected $casts = [
        'content_snapshot' => 'json',
        'settings_snapshot' => 'json',
    ];

    public function block()
    {
        return $this->belongsTo(Block::class);
    }
}
