<?php

namespace App\Enums;

enum PermissionEnum: string
{
    // Users
    case USERS_VIEW = 'users.view';
    case USERS_CREATE = 'users.create';
    case USERS_UPDATE = 'users.update';
    case USERS_DELETE = 'users.delete';
    case USERS_RESTORE = 'users.restore';
    case USERS_EXPORT = 'users.export';

    // Blog
    case BLOG_VIEW = 'blog.view';
    case BLOG_CREATE = 'blog.create';
    case BLOG_UPDATE = 'blog.update';
    case BLOG_PUBLISH = 'blog.publish';

    // Portfolio
    case PORTFOLIO_VIEW = 'portfolio.view';
    case PORTFOLIO_PUBLISH = 'portfolio.publish';
    case PORTFOLIO_FEATURE = 'portfolio.feature';

    // Media
    case MEDIA_MANAGE = 'media.manage';
    case MEDIA_UPLOAD = 'media.upload';

    // Settings
    case SETTINGS_MANAGE = 'settings.manage';

    // Navigation
    case NAVIGATION_MANAGE = 'navigation.manage';

    // SEO
    case SEO_MANAGE = 'seo.manage';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
