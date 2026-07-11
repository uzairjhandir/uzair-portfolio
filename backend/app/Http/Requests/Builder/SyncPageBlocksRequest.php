<?php

namespace App\Http\Requests\Builder;

use Illuminate\Foundation\Http\FormRequest;

class SyncPageBlocksRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'blocks' => ['required', 'array'],
            'blocks.*.uuid' => ['required', 'uuid', 'exists:blocks,uuid'],
            'blocks.*.instance_settings' => ['nullable', 'array'],
            'blocks.*.visibility_rules' => ['nullable', 'array'],
            'blocks.*.audience_rules' => ['nullable', 'array'],
            'blocks.*.conditions' => ['nullable', 'array'],
            'blocks.*.responsive_layout' => ['nullable', 'array'],
            'blocks.*.animation_settings' => ['nullable', 'array'],
            'blocks.*.anchor' => ['nullable', 'string', 'max:255'],
        ];
    }
}
