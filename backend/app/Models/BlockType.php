<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BlockType extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'icon',
        'is_singleton',
        'allowed_zones',
        'slots',
        'schema',
        'default_settings',
        'version',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_singleton' => 'boolean',
        'allowed_zones' => 'json',
        'slots' => 'json',
        'schema' => 'json',
        'default_settings' => 'json',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function blocks()
    {
        return $this->hasMany(Block::class);
    }
}
