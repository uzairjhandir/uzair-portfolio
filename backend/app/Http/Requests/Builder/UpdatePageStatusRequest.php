<?php

namespace App\Http\Requests\Builder;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\PageStatusEnum;
use Illuminate\Validation\Rules\Enum;

class UpdatePageStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(PageStatusEnum::class)],
            'publish_at' => ['nullable', 'date'],
        ];
    }
}
