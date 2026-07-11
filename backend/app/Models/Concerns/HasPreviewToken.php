<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

/**
 * Provides secure preview tokens for sharing unpublished content.
 */
trait HasPreviewToken
{
    public function generatePreviewToken(): string
    {
        $token = Str::random(64);
        $this->update(['preview_token' => $token]);
        return $token;
    }

    public function revokePreviewToken(): void
    {
        $this->update(['preview_token' => null]);
    }

    public function hasValidPreviewToken(string $token): bool
    {
        return $this->preview_token && hash_equals($this->preview_token, $token);
    }
}
