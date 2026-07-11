<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BuilderSession extends Model
{
    use HasUuids;

    protected $fillable = [
        'page_id',
        'user_id',
        'auto_saved_state',
        'started_at',
        'expires_at',
    ];

    protected $casts = [
        'auto_saved_state' => 'json',
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
