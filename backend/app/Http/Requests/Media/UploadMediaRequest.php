<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,webp,svg,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,mp4,webm,mp3',
                'max:51200' // 50MB
            ],
            'folder_uuid' => ['nullable', 'string', 'exists:media_folders,uuid'],
        ];
    }
}
