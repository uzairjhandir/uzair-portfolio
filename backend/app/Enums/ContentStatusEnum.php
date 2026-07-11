<?php

namespace App\Enums;

enum ContentStatusEnum: string
{
    case DRAFT = 'draft';
    case IN_REVIEW = 'in_review';
    case NEEDS_CHANGES = 'needs_changes';
    case APPROVED = 'approved';
    case SCHEDULED = 'scheduled';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';
    case EXPIRED = 'expired';

    public function label(): string
    {
        return match($this) {
            self::DRAFT => 'Draft',
            self::IN_REVIEW => 'In Review',
            self::NEEDS_CHANGES => 'Needs Changes',
            self::APPROVED => 'Approved',
            self::SCHEDULED => 'Scheduled',
            self::PUBLISHED => 'Published',
            self::ARCHIVED => 'Archived',
            self::EXPIRED => 'Expired',
        };
    }

    /**
     * Allowed state transitions — enforces the workflow.
     */
    public function allowedTransitions(): array
    {
        return match($this) {
            self::DRAFT         => [self::IN_REVIEW, self::ARCHIVED],
            self::IN_REVIEW     => [self::APPROVED, self::NEEDS_CHANGES, self::DRAFT],
            self::NEEDS_CHANGES => [self::DRAFT, self::IN_REVIEW],
            self::APPROVED      => [self::SCHEDULED, self::PUBLISHED, self::DRAFT],
            self::SCHEDULED     => [self::PUBLISHED, self::DRAFT],
            self::PUBLISHED     => [self::ARCHIVED],
            self::ARCHIVED      => [self::DRAFT],
            self::EXPIRED       => [self::ARCHIVED],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions());
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
