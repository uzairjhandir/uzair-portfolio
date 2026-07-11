<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class NavigationMenu extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'location',
        'status',
        'publish_date',
        'expire_date',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'publish_date' => 'datetime',
        'expire_date' => 'datetime',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function items()
    {
        return $this->hasMany(NavigationItem::class)->orderBy('sort_order');
    }

    public function rootItems()
    {
        return $this->hasMany(NavigationItem::class)->whereNull('parent_id')->orderBy('sort_order');
    }
}
