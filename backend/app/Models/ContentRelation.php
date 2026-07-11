<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentRelation extends Model
{
    protected $fillable = [
        'from_content_type', 'from_content_id',
        'to_content_type', 'to_content_id',
        'relation', 'weight', 'is_bidirectional', 'sort_order',
    ];

    protected $casts = [
        'weight' => 'float',
        'is_bidirectional' => 'boolean',
    ];

    public function fromContent()
    {
        return $this->morphTo('from_content');
    }

    public function toContent()
    {
        return $this->morphTo('to_content');
    }
}
