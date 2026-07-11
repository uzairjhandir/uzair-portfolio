<?php

namespace App\Modules\Notifications\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NotificationLog extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'payload'           => 'array',
        'provider_metadata' => 'array',
        'queued_at'         => 'datetime',
        'sent_at'           => 'datetime',
        'opened_at'         => 'datetime',
        'clicked_at'        => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
}
