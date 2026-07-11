<?php

namespace App\Modules\Crm;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CrmNote extends Model
{
    use HasUuids;

    protected $table = 'crm_notes';

    protected $fillable = [
        'contact_id', 'user_id', 'type',
        'content', 'occurred_at', 'is_pinned', 'metadata',
    ];

    protected $casts = [
        'is_pinned'   => 'boolean',
        'occurred_at' => 'datetime',
        'metadata'    => 'json',
    ];

    public function contact()
    {
        return $this->belongsTo(CrmContact::class, 'contact_id');
    }

    public function author()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
