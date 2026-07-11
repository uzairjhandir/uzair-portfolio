<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Block extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'block_type_id',
        'parent_block_id',
        'name',
        'variant',
        'is_global',
        'is_template',
        'is_locked',
        'content',
        'settings',
        'search_content',
        'tags',
        'status',
        'version',
        'publish_at',
        'expire_at',
        'is_searchable',
        'view_count',
        'click_count',
        'last_rendered_at',
        'locale',
        'translation_group_uuid',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_global' => 'boolean',
        'is_template' => 'boolean',
        'is_locked' => 'boolean',
        'is_searchable' => 'boolean',
        'content' => 'json',
        'settings' => 'json',
        'tags' => 'json',
        'publish_at' => 'datetime',
        'expire_at' => 'datetime',
        'last_rendered_at' => 'datetime',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function type()
    {
        return $this->belongsTo(BlockType::class, 'block_type_id');
    }

    public function parent()
    {
        return $this->belongsTo(Block::class, 'parent_block_id');
    }

    public function children()
    {
        return $this->hasMany(Block::class, 'parent_block_id');
    }

    public function revisions()
    {
        return $this->hasMany(BlockRevision::class)->orderBy('created_at', 'desc');
    }
}
