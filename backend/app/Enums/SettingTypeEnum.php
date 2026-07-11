<?php

namespace App\Enums;

enum SettingTypeEnum: string
{
    case STRING = 'string';
    case TEXT = 'text';
    case TEXTAREA = 'textarea';
    case BOOLEAN = 'boolean';
    case INTEGER = 'integer';
    case FLOAT = 'float';
    case JSON = 'json';
    case ARRAY = 'array';
    case IMAGE = 'image';
    case FILE = 'file';
    case PASSWORD = 'password';
    case EMAIL = 'email';
    case URL = 'url';
    case COLOR = 'color';
    case DATE = 'date';
    case DATETIME = 'datetime';
    case SELECT = 'select';
    case MULTISELECT = 'multiselect';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
