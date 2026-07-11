<?php

namespace App\Modules\Seo\Schema;

use App\Modules\Seo\Contracts\SchemaTypeInterface;
use App\Modules\Seo\Schema\Types\AbstractSchema;
use App\Modules\Seo\Schema\Types\BreadcrumbSchema;
use Illuminate\Database\Eloquent\Model;

/**
 * Schema Builder — Orchestrator
 *
 * Receives a model, selects the correct JSON-LD schema type,
 * and returns an array of schema objects ready for embedding.
 *
 * Returns an ARRAY because multiple schemas can be injected per page:
 *   - Primary schema (Article, Person, Project, etc.)
 *   - BreadcrumbList (always injected if model has a URL)
 *
 * Frontend embeds as:
 *   <script type="application/ld+json">
 *     { ...primarySchema }
 *   </script>
 *   <script type="application/ld+json">
 *     { ...breadcrumbSchema }
 *   </script>
 *
 * Extensibility:
 *   SeoServiceProvider::boot() registers new schema types via:
 *   $builder->register(new ProductSchema());
 */
class SchemaBuilder
{
    /** @var SchemaTypeInterface[] */
    private array $types = [];

    /** @var BreadcrumbSchema */
    private BreadcrumbSchema $breadcrumb;

    public function __construct()
    {
        $this->breadcrumb = new BreadcrumbSchema();
    }

    public function register(SchemaTypeInterface $type): void
    {
        $this->types[] = $type;
    }

    /**
     * Build all applicable JSON-LD schemas for the given model.
     *
     * @return array[]  Array of JSON-LD arrays (each is one <script> block)
     */
    public function build(Model $model, array $context = []): array
    {
        $schemas = [];

        // Detect and build the primary schema type
        foreach ($this->types as $type) {
            if ($type->supports($model)) {
                $schemas[] = $type->build($model, $context);
                break; // Only one primary schema per page
            }
        }

        // Always inject BreadcrumbList if model has a slug
        if ($this->breadcrumb->supports($model)) {
            $schemas[] = $this->breadcrumb->build($model, $context);
        }

        return $schemas;
    }

    /**
     * Build a single schema by explicit type name.
     * Useful when you know the type and want to skip detection.
     */
    public function buildByType(string $typeName, Model $model, array $context = []): ?array
    {
        foreach ($this->types as $type) {
            if ($type->type() === $typeName) {
                return $type->build($model, $context);
            }
        }

        return null;
    }

    /**
     * Detect which primary schema type applies to a model.
     * Used by the admin to preview what schema will be injected.
     */
    public function detect(Model $model): ?string
    {
        foreach ($this->types as $type) {
            if ($type->supports($model)) {
                return $type->type();
            }
        }

        return null;
    }
}
