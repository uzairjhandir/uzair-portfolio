<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SUPER_ADMIN = 'SUPER_ADMIN';
    case ADMIN = 'ADMIN';
    case EDITOR = 'EDITOR';
    case AUTHOR = 'AUTHOR';
    case CONTRIBUTOR = 'CONTRIBUTOR';
    case CLIENT = 'CLIENT';
    case USER = 'USER';
    case API = 'API';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
