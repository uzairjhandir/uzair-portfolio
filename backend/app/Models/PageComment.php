<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageComment extends Model
{
    protected $fillable = [
        'page_id',
        'user_id',
        'block_id',
        'comment',
        'resolved',
    ];

    protected $casts = [
        'resolved' => 'boolean',
    ];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function block()
    {
        return $this->belongsTo(Block::class);
    }
}
