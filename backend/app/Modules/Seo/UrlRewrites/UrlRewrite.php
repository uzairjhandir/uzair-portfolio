<?php

namespace App\Modules\Seo\UrlRewrites;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

/**
 * URL Rewrite Model
 *
 * URL Rewrites differ from Redirects:
 *   - Redirects: client receives a 301/302/etc., browser navigates to new URL
 *   - Rewrites: server resolves a different internal path transparently —
 *               the client's address bar does NOT change
 *
 * Example use cases:
 *   /blog/category/php  → /blog/php     (clean URL without changing client URL)
 *   /p/{slug}           → /portfolio/{slug}  (short-link internal alias)
 */
class UrlRewrite extends Model
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    protected $table = 'url_rewrites';

    protected $fillable = [
        'source_pattern', 'target_path', 'match_type',
        'is_active', 'priority', 'note', 'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'priority'  => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('priority');
    }

    /**
     * Whether this rewrite's source pattern matches the given path.
     */
    public function matches(string $requestPath): bool
    {
        return match ($this->match_type) {
            'exact'    => $this->source_pattern === $requestPath,
            'wildcard' => Str::is($this->source_pattern, $requestPath),
            'regex'    => (bool) preg_match($this->source_pattern, $requestPath),
            default    => false,
        };
    }

    /**
     * Resolve the internal target path (with regex capture group substitution).
     */
    public function resolveTarget(string $requestPath): string
    {
        if ($this->match_type === 'regex') {
            return preg_replace($this->source_pattern, $this->target_path, $requestPath);
        }

        return $this->target_path;
    }
}
