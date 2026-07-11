<?php

namespace App\Enums;

enum ContentTypeEnum: string
{
    case PAGE = 'page';
    case BLOG = 'blog';
    case PORTFOLIO = 'portfolio';
    case CASE_STUDY = 'case_study';
    case LANDING = 'landing';
    case DOCUMENTATION = 'documentation';
    case KNOWLEDGE_BASE = 'knowledge_base';
    case PRESS_RELEASE = 'press_release';

    public function label(): string
    {
        return match($this) {
            self::PAGE => 'Page',
            self::BLOG => 'Blog Post',
            self::PORTFOLIO => 'Portfolio Item',
            self::CASE_STUDY => 'Case Study',
            self::LANDING => 'Landing Page',
            self::DOCUMENTATION => 'Documentation',
            self::KNOWLEDGE_BASE => 'Knowledge Base',
            self::PRESS_RELEASE => 'Press Release',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
