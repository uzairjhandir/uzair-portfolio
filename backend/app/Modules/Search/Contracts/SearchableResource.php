<?php

namespace App\Modules\Search\Contracts;

interface SearchableResource
{
    /**
     * Map the eloquent model to a flat array suitable for the search index.
     * Required keys typically include: 'title', 'summary', 'content', 'url', 'status', 'visibility'
     */
    public function toSearchDocument(): array;

    /**
     * The type label, e.g., "blog", "portfolio", "download"
     */
    public function getSearchType(): string;

    /**
     * Determines if the model should currently be indexed (e.g. status === 'published')
     */
    public function isSearchable(): bool;

    /**
     * Relevance boost factor.
     */
    public function getSearchBoost(): int;
}
