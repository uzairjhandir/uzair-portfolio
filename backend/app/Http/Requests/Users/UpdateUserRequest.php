<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorize via Policy in Controller
    }

    public function rules(): array
    {
        // Assuming the route parameter is named 'user' and is the UUID.
        // We will need to map UUID to ID for unique rule, or just ignore UUID.
        $uuid = $this->route('uuid'); 

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', Rule::unique('users', 'username')->ignore($uuid, 'uuid')],
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($uuid, 'uuid')],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:20'],
            'job_title' => ['nullable', 'string', 'max:100'],
            'timezone' => ['nullable', 'string'],
            'locale' => ['nullable', 'string', 'size:2'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'suspended'])],
        ];
    }
}
