<?php

namespace App\Http\Requests\Navigation;

use Illuminate\Foundation\Http\FormRequest;

class ReorderNavigationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tree' => ['required', 'array'],
            'tree.*.uuid' => ['required', 'string', 'exists:navigation_items,uuid'],
            'tree.*.parent_uuid' => ['nullable', 'string', 'exists:navigation_items,uuid'],
            'tree.*.sort_order' => ['required', 'integer'],
        ];
    }
}
