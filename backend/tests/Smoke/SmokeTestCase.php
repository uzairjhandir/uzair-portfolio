<?php

namespace Tests\Smoke;

use Tests\TestCase;

/**
 * Smoke tests do not refresh the database or mock external services.
 * They are designed to run directly against a Staging or Production environment
 * after deployment to ensure critical services are online.
 */
abstract class SmokeTestCase extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure we are testing the actual live environment if explicitly configured
        // (usually requires setting APP_URL to the target environment)
    }
}
