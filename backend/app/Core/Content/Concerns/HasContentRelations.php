<?php

namespace App\Core\Content\Concerns;

use App\Enums\ContentRelationTypeEnum;
use App\Models\ContentRelation;
use Illuminate\Database\Eloquent\Model;

/**
 * Polymorphic content relationship graph.
 * Relation types are constrained by ContentRelationTypeEnum — no typo-related bugs.
 *
 * Usage:
 *   use ContentRelationTypeEnum as Rel;
 *   $portfolio->relateTo($caseStudy, Rel::PRIMARY_OF);
 *   $blog->relateTo($blog2, Rel::SUCCESSOR);
 *   $blog->relatedContent(Rel::RELATED);
 */
trait HasContentRelations
{
    public function relationsFrom()
    {
        return $this->morphMany(ContentRelation::class, 'from_content');
    }

    public function relationsTo()
    {
        return $this->morphMany(ContentRelation::class, 'to_content');
    }

    public function relateTo(
        Model $target,
        ContentRelationTypeEnum $relation = ContentRelationTypeEnum::RELATED,
        float $weight = 1.0,
        bool $bidirectional = false
    ): ContentRelation {
        $rel = ContentRelation::firstOrCreate([
            'from_content_type' => static::class,
            'from_content_id'   => $this->id,
            'to_content_type'   => $target::class,
            'to_content_id'     => $target->id,
            'relation'          => $relation->value,
        ], [
            'weight'           => $weight,
            'is_bidirectional' => $bidirectional,
        ]);

        if ($bidirectional) {
            ContentRelation::firstOrCreate([
                'from_content_type' => $target::class,
                'from_content_id'   => $target->id,
                'to_content_type'   => static::class,
                'to_content_id'     => $this->id,
                'relation'          => $relation->inverse()->value,
            ], ['weight' => $weight, 'is_bidirectional' => true]);
        }

        event(new \App\Events\ContentUpdated($this));
        return $rel;
    }

    public function unrelate(Model $target, ContentRelationTypeEnum $relation = ContentRelationTypeEnum::RELATED): void
    {
        ContentRelation::where('from_content_type', static::class)
            ->where('from_content_id', $this->id)
            ->where('to_content_type', $target::class)
            ->where('to_content_id', $target->id)
            ->where('relation', $relation->value)
            ->delete();
    }

    public function relatedContent(ContentRelationTypeEnum $relation = ContentRelationTypeEnum::RELATED): \Illuminate\Support\Collection
    {
        return $this->relationsFrom()
            ->where('relation', $relation->value)
            ->orderByDesc('weight')
            ->orderBy('sort_order')
            ->get()
            ->map(fn($rel) => $rel->toContent)
            ->filter();
    }
}
