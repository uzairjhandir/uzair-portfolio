<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuilderHistory extends Model
{
    protected $table = 'builder_history';

    protected $fillable = [
        'page_id',
        'user_id',
        'action',
        'snapshot',
    ];

    protected $casts = [
        'snapshot' => 'json',
    ];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
