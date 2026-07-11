<?php

namespace App\Enums;

enum NavigationVisibilityEnum: string
{
    case PUBLIC = 'public';
    case AUTHENTICATED = 'authenticated';
    case GUEST = 'guest';
    case ROLE_BASED = 'role_based';
    case PERMISSION_BASED = 'permission_based';
    case CUSTOM_RULE = 'custom_rule';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
