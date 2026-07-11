<?php

namespace App\Enums;

enum BlockCategoryEnum: string
{
    case MARKETING = 'marketing';
    case CONTENT = 'content';
    case MEDIA = 'media';
    case LAYOUT = 'layout';
    case INTERACTIVE = 'interactive';
    case COMMERCE = 'commerce';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
