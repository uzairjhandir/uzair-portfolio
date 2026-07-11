<?php

namespace App\Modules\DeveloperPortal\Catalogs;

class ErrorCatalog
{
    /**
     * Retrieves the master list of unified API error codes.
     * In an enterprise setup, this might be backed by a DB or multiple config files,
     * but defining them centrally allows auto-generation of Docs.
     */
    public function getAllErrors(): array
    {
        return [
            'AUTH_001' => [
                'status'      => 401,
                'title'       => 'Invalid Credentials',
                'description' => 'The provided username or password was incorrect.',
                'resolution'  => 'Check credentials and ensure the user account is active.',
                'docs_url'    => '/docs/api/errors/AUTH_001',
            ],
            'AUTH_002' => [
                'status'      => 403,
                'title'       => 'Account Locked',
                'description' => 'The account has been locked due to too many failed login attempts.',
                'resolution'  => 'Wait 15 minutes or trigger a password reset.',
                'docs_url'    => '/docs/api/errors/AUTH_002',
            ],
            'CRM_015' => [
                'status'      => 400,
                'title'       => 'Invalid Lead Transition',
                'description' => 'A lead cannot be moved to "Closed" without a set value.',
                'resolution'  => 'Ensure lead.value is populated before transitioning to Closed.',
                'docs_url'    => '/docs/api/errors/CRM_015',
            ],
            'CONTENT_004' => [
                'status'      => 404,
                'title'       => 'Content Not Found',
                'description' => 'The requested post, page, or portfolio item does not exist or is not published.',
                'resolution'  => 'Verify the UUID and ensure status is "published".',
                'docs_url'    => '/docs/api/errors/CONTENT_004',
            ],
            // Reserved mapping for AUTOMATION, SEARCH, SEO, MEDIA, etc.
        ];
    }
}
