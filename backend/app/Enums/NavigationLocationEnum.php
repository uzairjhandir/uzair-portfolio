<?php

namespace App\Enums;

enum NavigationLocationEnum: string
{
    case PRIMARY = 'primary';
    case SECONDARY = 'secondary';
    case FOOTER = 'footer';
    case FOOTER_LEGAL = 'footer_legal';
    case SIDEBAR = 'sidebar';
    case USER_MENU = 'user_menu';
    case DASHBOARD = 'dashboard';
    case DOCUMENTATION = 'documentation';
    case MOBILE = 'mobile';
    case MEGA_MENU = 'mega_menu';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
