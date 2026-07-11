<?php

namespace App\Modules\Seo\Schema\Types;

/**
 * Digital Document Schema — Downloads
 *
 * Applied to: Download model
 *
 * Output:
 * {
 *   "@context": "https://schema.org",
 *   "@type": "DigitalDocument",
 *   "name": "...",
 *   "description": "...",
 *   "url": "...",
 *   "fileFormat": "application/pdf",
 *   "encodingFormat": "application/pdf"
 * }
 */
class DigitalDocumentSchema extends AbstractSchema
{
    public function type(): string { return 'DigitalDocument'; }

    public function supports(object $model): bool
    {
        return $model instanceof \App\Modules\Downloads\Download;
    }

    public function build(object $model, array $context = []): array
    {
        $seo = $this->loadSeo($model);

        $schema = [
            'name'        => $seo?->title ?? $model->title ?? '',
            'description' => $seo?->description ?? $model->description ?? '',
            'url'         => $this->modelUrl($model),
            'publisher'   => $this->organizationStub(),
        ];

        // File format from model's media relationship (if available)
        if (!empty($model->mime_type)) {
            $schema['fileFormat']     = $model->mime_type;
            $schema['encodingFormat'] = $model->mime_type;
        }

        if (!empty($model->file_size)) {
            $schema['contentSize'] = $model->file_size . ' bytes';
        }

        return $this->wrap('DigitalDocument', $schema);
    }
}
