<?php

namespace App\Modules\Seo\Health;

/**
 * SEO Health Report — Value Object
 *
 * Returned by SeoHealthChecker::check().
 * Immutable. Always valid — never null.
 */
final class SeoHealthReport
{
    public function __construct(
        public readonly int    $score,
        public readonly array  $results,
        public readonly string $model,
        public readonly string $uuid,
    ) {}

    public function grade(): string
    {
        return match (true) {
            $this->score >= 90 => 'A',
            $this->score >= 80 => 'B',
            $this->score >= 70 => 'C',
            $this->score >= 50 => 'D',
            default            => 'F',
        };
    }

    public function passed(): array
    {
        return array_filter($this->results, fn($r) => $r['passed']);
    }

    public function failed(): array
    {
        return array_filter($this->results, fn($r) => !$r['passed']);
    }

    public function toArray(): array
    {
        return [
            'score'   => $this->score,
            'grade'   => $this->grade(),
            'model'   => $this->model,
            'uuid'    => $this->uuid,
            'passed'  => count($this->passed()),
            'failed'  => count($this->failed()),
            'checks'  => array_values($this->results),
        ];
    }
}
