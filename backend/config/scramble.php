<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Routes Configuration
    |--------------------------------------------------------------------------
    |
    | Define the route patterns that Scramble should parse.
    | We support isolated versioning (/api/v1 and /api/v2).
    |
    */
    'api_path' => 'api/v1',
    'api_domain' => null,

    'info' => [
        'version' => env('API_VERSION', '1.0.0'),
        'description' => 'Enterprise DXP API Documentation',
    ],

    /*
    |--------------------------------------------------------------------------
    | UI Configuration
    |--------------------------------------------------------------------------
    |
    | We will serve our custom Developer Portal, but Scramble can serve
    | a default Stoplight Elements UI.
    |
    */
    'ui' => [
        'title' => 'DXP API',
        'theme' => 'light',
        'hide_try_it' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Open API Export
    |--------------------------------------------------------------------------
    |
    | Automatically detect deprecation via @deprecated PHPDoc tags.
    |
    */
    'export_path' => 'storage/app/openapi',
    'support_deprecation' => true,
    
    // Scramble handles FormRequests and API Resources out of the box via AST
];
