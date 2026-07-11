<?php

namespace App\Modules\Seo\Schema\Types;

/**
 * FAQ Page Schema
 *
 * Applied to: Pages with schema_type = 'FAQPage' OR Pages that have FAQ blocks.
 *
 * Extracts Q&A pairs from blocks JSON (FAQ block type) and builds FAQPage schema.
 *
 * Each FAQ block item expected format:
 *   { "question": "...", "answer": "..." }
 */
class FAQPageSchema extends AbstractSchema
{
    public function type(): string { return 'FAQPage'; }

    public function supports(object $model): bool
    {
        $seo = $this->loadSeo($model);
        if ($seo?->schema_type === 'FAQPage') {
            return true;
        }

        // Auto-detect: Page has FAQ blocks
        if (!empty($model->blocks) && is_array($model->blocks)) {
            foreach ($model->blocks as $block) {
                if (($block['type'] ?? '') === 'faq') {
                    return true;
                }
            }
        }

        return false;
    }

    public function build(object $model, array $context = []): array
    {
        $questions = $this->extractFaqItems($model);

        if (empty($questions)) {
            // Fallback to empty valid FAQPage
            return $this->wrap('FAQPage', ['mainEntity' => []]);
        }

        return $this->wrap('FAQPage', [
            'mainEntity' => array_map(fn($q) => [
                '@type'          => 'Question',
                'name'           => $q['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => strip_tags($q['answer']),
                ],
            ], $questions),
        ]);
    }

    private function extractFaqItems(object $model): array
    {
        $items = [];

        if (empty($model->blocks) || !is_array($model->blocks)) {
            return $items;
        }

        foreach ($model->blocks as $block) {
            if (($block['type'] ?? '') !== 'faq') {
                continue;
            }

            foreach ($block['data']['items'] ?? [] as $item) {
                if (!empty($item['question']) && !empty($item['answer'])) {
                    $items[] = $item;
                }
            }
        }

        return $items;
    }
}
