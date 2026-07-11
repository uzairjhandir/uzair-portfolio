<?php

namespace App\Enums;

enum PageStatusEnum: string
{
    case DRAFT = 'draft';
    case IN_REVIEW = 'in_review';
    case APPROVED = 'approved';
    case SCHEDULED = 'scheduled';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
