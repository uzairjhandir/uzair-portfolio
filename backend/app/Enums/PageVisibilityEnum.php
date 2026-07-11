<?php

namespace App\Enums;

enum PageVisibilityEnum: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';
    case MEMBERS_ONLY = 'members_only';
    case AUTHENTICATED = 'authenticated';
    case PASSWORD_PROTECTED = 'password_protected';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
