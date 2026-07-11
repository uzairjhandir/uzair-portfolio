<?php

namespace App\Modules\Seo\Health;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * SEO Health Checker
 *
 * Runs a configurable checklist against any content model
 * and returns a SeoHealthReport with an overall score (0–100)
 * and per-rule breakdown.
 *
 * 10 core checks × 10 points each = 100 max.
 * 5 extended checks (informational, 0 points) — flagged in report but do not affect score.
 *
 * Extended checks (async via RunSeoAuditJob):
 *   - MissingAlt, BrokenLinks, DuplicateTitles, DuplicateMeta,
 *     MultipleH1, BrokenRedirectChains, OrphanPages, LargeImages
 */
class SeoHealthChecker
{
    /** @var array<string, array{label: string, points: int}> */
    private array $coreChecks = [
        'title_exists'           => ['label' => 'SEO title exists',                'points' => 10],
        'title_length'           => ['label' => 'Title length (30–60 chars)',       'points' => 10],
        'description_exists'     => ['label' => 'Meta description exists',          'points' => 10],
        'description_length'     => ['label' => 'Description length (120–160)',     'points' => 10],
        'canonical_exists'       => ['label' => 'Canonical URL set',               'points' => 10],
        'og_image_exists'        => ['label' => 'OG image set',                    'points' => 10],
        'focus_keyword_exists'   => ['label' => 'Focus keyword set',               'points' => 10],
        'keyword_in_title'       => ['label' => 'Keyword appears in title',        'points' => 10],
        'schema_exists'          => ['label' => 'JSON-LD schema present',          'points' => 10],
        'not_noindex'            => ['label' => 'Not set to noindex',              'points' => 10],
    ];

    public function check(Model $model): SeoHealthReport
    {
        $seo = DB::table('seo_metadata')
            ->where('seoable_type', get_class($model))
            ->where('seoable_id', $model->id)
            ->first();

        $results = [];
        $total   = 0;

        // ── Title ──────────────────────────────────────────────────────────────
        $title = $seo?->title ?? $model->title ?? null;

        $results['title_exists'] = $this->result(
            'title_exists',
            !empty($title),
            $seo?->title ? 'Custom SEO title set.' : 'Using model title as fallback.',
            $seo?->title ? null : 'Set a custom SEO title in the SEO tab.'
        );

        $titleLen = mb_strlen($title ?? '');
        $results['title_length'] = $this->result(
            'title_length',
            $titleLen >= 30 && $titleLen <= 60,
            "Title is {$titleLen} characters.",
            $titleLen < 30 ? 'Title too short — aim for 30–60 characters.' : 'Title too long — trim to 60 characters.'
        );

        // ── Description ────────────────────────────────────────────────────────
        $desc    = $seo?->description ?? $model->excerpt ?? null;
        $descLen = mb_strlen($desc ?? '');

        $results['description_exists'] = $this->result(
            'description_exists',
            !empty($desc),
            'Meta description found.',
            'Add a meta description in the SEO tab.'
        );

        $results['description_length'] = $this->result(
            'description_length',
            $descLen >= 120 && $descLen <= 160,
            "Description is {$descLen} characters.",
            $descLen < 120 ? 'Description too short — aim for 120–160 characters.' : 'Description too long — trim to 160 characters.'
        );

        // ── Canonical ──────────────────────────────────────────────────────────
        $results['canonical_exists'] = $this->result(
            'canonical_exists',
            !empty($seo?->canonical_url),
            'Canonical URL set.',
            'Set a canonical URL or enable auto-canonical generation.'
        );

        // ── OG Image ──────────────────────────────────────────────────────────
        $results['og_image_exists'] = $this->result(
            'og_image_exists',
            !empty($seo?->og_image_id),
            'OG image set.',
            'Upload an OG image (1200×630px recommended).'
        );

        // ── Focus Keyword ──────────────────────────────────────────────────────
        $keyword = $seo?->focus_keyword ?? null;

        $results['focus_keyword_exists'] = $this->result(
            'focus_keyword_exists',
            !empty($keyword),
            'Focus keyword set.',
            'Set a focus keyword in the SEO tab.'
        );

        $results['keyword_in_title'] = $this->result(
            'keyword_in_title',
            $keyword && $title && stripos($title, $keyword) !== false,
            'Focus keyword found in title.',
            'Include your focus keyword in the SEO title.'
        );

        // ── Schema ────────────────────────────────────────────────────────────
        $results['schema_exists'] = $this->result(
            'schema_exists',
            !empty($seo?->schema_markup) || !empty($seo?->schema_type),
            'JSON-LD schema configured.',
            'Set a schema type in the SEO tab for better rich results.'
        );

        // ── Robots ────────────────────────────────────────────────────────────
        $results['not_noindex'] = $this->result(
            'not_noindex',
            !str_contains($seo?->robots ?? 'index,follow', 'noindex'),
            'Page is indexable.',
            'This page is set to noindex — it will not appear in search results.'
        );

        // ── Tally ─────────────────────────────────────────────────────────────
        foreach ($results as $key => $result) {
            if ($result['passed']) {
                $total += $this->coreChecks[$key]['points'];
            }
        }

        // Persist score to seo_metadata
        if ($seo) {
            DB::table('seo_metadata')
                ->where('id', $seo->id)
                ->update([
                    'seo_score'       => $total,
                    'last_audited_at' => now(),
                ]);
        }

        return new SeoHealthReport(
            score:   $total,
            results: $results,
            model:   get_class($model),
            uuid:    $model->uuid ?? (string) $model->id,
        );
    }

    /**
     * Aggregate SEO health overview across all content types.
     * Used by Module 19 Dashboard widgets.
     *
     * @return array{ average_score: int, by_type: array, low_score_count: int }
     */
    public function overview(): array
    {
        $data = DB::table('seo_metadata')
            ->whereNotNull('seo_score')
            ->selectRaw('seoable_type, AVG(seo_score) as avg_score, COUNT(*) as count, SUM(CASE WHEN seo_score < 50 THEN 1 ELSE 0 END) as low_count')
            ->groupBy('seoable_type')
            ->get();

        $overallSum   = 0;
        $overallCount = 0;
        $byType       = [];

        foreach ($data as $row) {
            $class         = class_basename($row->seoable_type);
            $overallSum   += $row->avg_score * $row->count;
            $overallCount += $row->count;
            $byType[]      = [
                'type'          => $class,
                'avg_score'     => round($row->avg_score, 1),
                'count'         => $row->count,
                'low_score_count' => $row->low_count,
            ];
        }

        return [
            'average_score'   => $overallCount > 0 ? round($overallSum / $overallCount, 1) : 0,
            'by_type'         => $byType,
            'low_score_count' => array_sum(array_column($byType, 'low_score_count')),
        ];
    }

    private function result(string $key, bool $passed, string $message, ?string $fix = null): array
    {
        return [
            'key'     => $key,
            'label'   => $this->coreChecks[$key]['label'],
            'points'  => $this->coreChecks[$key]['points'],
            'passed'  => $passed,
            'message' => $message,
            'fix'     => $passed ? null : $fix,
        ];
    }
}
