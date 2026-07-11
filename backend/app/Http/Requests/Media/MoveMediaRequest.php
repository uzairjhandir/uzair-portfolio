<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class MoveMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'media_uuids' => ['required', 'array'],
            'media_uuids.*' => ['string', 'exists:media,uuid'],
            'folder_uuid' => ['nullable', 'string', 'exists:media_folders,uuid'],
        ];
    }
}
