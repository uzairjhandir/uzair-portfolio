<?php

namespace App\Http\Requests\Pages;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent_uuid' => ['nullable', 'string', 'exists:pages,uuid'],
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255'],
            'breadcrumb_title' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'blocks' => ['nullable', 'array'],
            'template' => ['nullable', 'string'],
            'layout' => ['nullable', 'string'],
            'type' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'visibility' => ['nullable', 'string'],
            'password' => ['nullable', 'string'],
            'publish_date' => ['nullable', 'date'],
            'expire_date' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer'],
            'change_summary' => ['nullable', 'string'], // Used for revisions
            
            // Relationships
            'featured_image_uuid' => ['nullable', 'string', 'exists:media,uuid'],
            'banner_uuid' => ['nullable', 'string', 'exists:media,uuid'],
            'og_image_uuid' => ['nullable', 'string', 'exists:media,uuid'],
            
            // Navigation
            'show_in_header' => ['nullable', 'boolean'],
            'show_in_footer' => ['nullable', 'boolean'],
            'show_in_sitemap' => ['nullable', 'boolean'],
            'show_in_search' => ['nullable', 'boolean'],
            'show_in_breadcrumb' => ['nullable', 'boolean'],
        ];
    }
}
