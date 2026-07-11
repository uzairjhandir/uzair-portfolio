<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PageBlock extends Model
{
    use HasUuids;

    protected $fillable = [
        'page_id',
        'block_id',
        'anchor',
        'sort_order',
        'instance_settings',
        'visibility_rules',
        'audience_rules',
        'conditions',
        'responsive_layout',
        'animation_settings',
        'experiment_id',
        'traffic_percentage',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'instance_settings' => 'json',
        'visibility_rules' => 'json',
        'audience_rules' => 'json',
        'conditions' => 'json',
        'responsive_layout' => 'json',
        'animation_settings' => 'json',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function block()
    {
        return $this->belongsTo(Block::class);
    }
}
