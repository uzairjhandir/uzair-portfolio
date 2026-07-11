<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Boot the testing helper traits.
     * Use this class for Feature and Unit tests that require full application boot.
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock any external services that should never run during testing
        // e.g., Mail::fake(); Queue::fake();
    }
}
