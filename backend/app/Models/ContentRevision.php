<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentRevision extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'revisable_type',
        'revisable_id',
        'version',
        'comment',
        'snapshot',
        'created_by',
        'created_at',
    ];

    protected $casts = [
        'snapshot' => 'array',
        'created_at' => 'datetime',
    ];

    public function revisable()
    {
        return $this->morphTo();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
