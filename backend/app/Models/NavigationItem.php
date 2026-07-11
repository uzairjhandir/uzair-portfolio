<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class NavigationItem extends Model
{
    use HasUuids;

    protected $fillable = [
        'navigation_menu_id',
        'parent_id',
        'page_id',
        'type',
        'custom_url',
        'label',
        'target',
        'rel',
        'tooltip',
        'css_class',
        'badge',
        'visibility',
        'roles',
        'permissions',
        'icon_type',
        'icon_value',
        'media_id',
        'sort_order',
        'columns',
        'featured_card',
        'groups',
        'locale',
        'translation_key',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'roles' => 'json',
        'permissions' => 'json',
        'columns' => 'json',
        'featured_card' => 'json',
        'groups' => 'json',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function menu()
    {
        return $this->belongsTo(NavigationMenu::class, 'navigation_menu_id');
    }

    public function parent()
    {
        return $this->belongsTo(NavigationItem::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(NavigationItem::class, 'parent_id')->orderBy('sort_order');
    }

    public function page()
    {
        return $this->belongsTo(Page::class, 'page_id');
    }

    public function media()
    {
        return $this->belongsTo(Media::class, 'media_id');
    }
}
