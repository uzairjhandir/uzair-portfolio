<?php

namespace App\Http\Requests\Blocks;

use Illuminate\Foundation\Http\FormRequest;

class CreateBlockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'block_type_uuid' => ['required', 'string', 'exists:block_types,uuid'],
            'parent_block_uuid' => ['nullable', 'string', 'exists:blocks,uuid'],
            'name' => ['nullable', 'string', 'max:255'],
            'variant' => ['nullable', 'string', 'max:255'],
            'is_global' => ['nullable', 'boolean'],
            'is_locked' => ['nullable', 'boolean'],
            'content' => ['nullable', 'array'],
            'settings' => ['nullable', 'array'],
            'status' => ['nullable', 'string'],
            'publish_at' => ['nullable', 'date'],
            'expire_at' => ['nullable', 'date'],
            'is_searchable' => ['nullable', 'boolean'],
            'locale' => ['nullable', 'string'],
        ];
    }
}
