<?php

namespace App\Modules\DeveloperPortal\Controllers;

use Illuminate\Http\Response;

class ApiDocsController
{
    /**
     * Serves the interactive Swagger UI.
     * 
     * In a real implementation using Dedoc/Scramble, Scramble registers its own
     * /docs/api endpoint. But for a custom Developer Portal that also
     * provides SDK generation docs, Webhooks, and Error Catalogs, we serve
     * a custom container.
     */
    public function swagger(string $version = 'v1'): Response
    {
        // For architectural demonstration, we return a simple HTML shell that
        // loads Swagger UI pointing to our generated spec file.
        $specUrl = url("/api/docs/{$version}/openapi.json");
        
        $html = <<<HTML
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>DXP API Documentation ({$version})</title>
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
        </head>
        <body>
            <div id="swagger-ui"></div>
            <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
            <script>
                window.onload = () => {
                    window.ui = SwaggerUIBundle({
                        url: '{$specUrl}',
                        dom_id: '#swagger-ui',
                        deepLinking: true,
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIBundle.SwaggerUIStandalonePreset
                        ],
                    });
                };
            </script>
        </body>
        </html>
        HTML;

        return response($html);
    }

    /**
     * Serves Redoc (Clean reference UI).
     */
    public function redoc(string $version = 'v1'): Response
    {
        $specUrl = url("/api/docs/{$version}/openapi.json");
        
        $html = <<<HTML
        <!DOCTYPE html>
        <html>
        <head>
            <title>DXP API Reference ({$version})</title>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <redoc spec-url="{$specUrl}"></redoc>
            <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        </body>
        </html>
        HTML;

        return response($html);
    }

    /**
     * Postman Collection Export Helper
     * Converts OpenAPI to Postman Collection v2.1
     */
    public function postman(string $version = 'v1')
    {
        // Normally requires openapi-to-postmanv2 library.
        // We will mock the response structure.
        return response()->json([
            'info' => [
                'name' => 'DXP API Postman Collection',
                'schema' => 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
            ],
            'item' => [
                // Populated via openapi conversion
            ]
        ])->header('Content-Disposition', 'attachment; filename="postman_collection.json"');
    }

    /**
     * Fallback for openapi.json if Scramble isn't serving it natively in this env.
     */
    public function spec(string $version = 'v1')
    {
        $path = storage_path("app/openapi_{$version}.json");
        if (!file_exists($path)) {
            // Provide a dummy spec for architecture validation if real file is missing
            return response()->json([
                'openapi' => '3.1.0',
                'info' => ['title' => 'DXP API', 'version' => $version],
                'paths' => []
            ]);
        }
        return response()->file($path);
    }
}
