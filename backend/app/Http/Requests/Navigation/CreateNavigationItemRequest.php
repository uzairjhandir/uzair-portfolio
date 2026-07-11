<?php

namespace App\Http\Requests\Navigation;

use Illuminate\Foundation\Http\FormRequest;

class CreateNavigationItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'navigation_menu_uuid' => ['required', 'string', 'exists:navigation_menus,uuid'],
            'parent_uuid' => ['nullable', 'string', 'exists:navigation_items,uuid'],
            'page_uuid' => ['nullable', 'string', 'exists:pages,uuid'],
            'type' => ['required', 'string'],
            'custom_url' => ['nullable', 'string'],
            'label' => ['required', 'string', 'max:255'],
            'target' => ['nullable', 'string'],
            'rel' => ['nullable', 'string'],
            'tooltip' => ['nullable', 'string'],
            'css_class' => ['nullable', 'string'],
            'badge' => ['nullable', 'string'],
            'visibility' => ['nullable', 'string'],
            'roles' => ['nullable', 'array'],
            'permissions' => ['nullable', 'array'],
            'icon_type' => ['nullable', 'string'],
            'icon_value' => ['nullable', 'string'],
            'media_uuid' => ['nullable', 'string', 'exists:media,uuid'],
            'sort_order' => ['nullable', 'integer'],
        ];
    }
}
