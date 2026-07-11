<?php

namespace App\Modules\Seo\Redirects;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Redirect extends Model
{
    use HasUuids;

    protected $table = 'redirects';

    protected $fillable = [
        'source_path', 'target_path', 'http_code',
        'match_type', 'is_active', 'is_auto',
        'hit_count', 'last_accessed_at', 'note', 'created_by',
    ];

    protected $casts = [
        'is_active'        => 'boolean',
        'is_auto'          => 'boolean',
        'http_code'        => 'integer',
        'hit_count'        => 'integer',
        'last_accessed_at' => 'datetime',
    ];

    // ── Scopes ────────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeGone($query)
    {
        return $query->where('http_code', 410);
    }

    public function scopeByType($query, string $matchType)
    {
        return $query->where('match_type', $matchType);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isGone(): bool
    {
        return $this->http_code === 410;
    }

    public function isPermanent(): bool
    {
        return in_array($this->http_code, [301, 308]);
    }

    /**
     * Resolve whether this redirect's source matches the given path.
     * Returns the target path (or null for 410) if matched; false if not matched.
     */
    public function matches(string $requestPath): bool
    {
        return match ($this->match_type) {
            'exact'    => $this->source_path === $requestPath,
            'wildcard' => Str::is($this->source_path, $requestPath),
            'regex'    => (bool) preg_match($this->source_path, $requestPath),
            default    => false,
        };
    }

    /**
     * Resolve the target URL for a regex redirect with capture groups.
     * e.g. source: /blog/(.*)  target: /articles/$1
     */
    public function resolveTarget(string $requestPath): ?string
    {
        if ($this->match_type === 'regex' && $this->target_path) {
            return preg_replace($this->source_path, $this->target_path, $requestPath);
        }

        return $this->target_path;
    }
}
