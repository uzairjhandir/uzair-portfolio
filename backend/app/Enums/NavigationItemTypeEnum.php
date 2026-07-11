<?php

namespace App\Enums;

enum NavigationItemTypeEnum: string
{
    case PAGE = 'page';
    case HOMEPAGE = 'homepage';
    case BLOG = 'blog';
    case BLOG_CATEGORY = 'blog_category';
    case PORTFOLIO = 'portfolio';
    case CASE_STUDY = 'case_study';
    case ANCHOR = 'anchor';
    case EXTERNAL = 'external';
    case CUSTOM = 'custom';
    case SYSTEM = 'system';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
