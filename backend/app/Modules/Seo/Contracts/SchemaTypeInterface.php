<?php

namespace App\Modules\Seo\Contracts;

/**
 * Schema Type Contract
 *
 * Every JSON-LD schema type implements this interface.
 * SchemaBuilder selects the correct type and calls build().
 *
 * The AbstractSchema base class provides shared helpers.
 * New schema types (Product, Course, Event, JobPosting, VideoObject)
 * simply extend AbstractSchema and override build().
 */
interface SchemaTypeInterface
{
    /**
     * The JSON-LD @type value this class handles.
     * Examples: 'Article', 'Person', 'Organization', 'Project'
     */
    public function type(): string;

    /**
     * Build the JSON-LD array for the given model.
     *
     * @param  object  $model   Any Eloquent model with HasContentSeo
     * @param  array   $context Additional data (breadcrumbs, author, etc.)
     * @return array            Ready for json_encode() → <script type="application/ld+json">
     */
    public function build(object $model, array $context = []): array;

    /**
     * Whether this schema type applies to the given model.
     * SchemaBuilder::detect() iterates registered types and calls supports().
     */
    public function supports(object $model): bool;
}
