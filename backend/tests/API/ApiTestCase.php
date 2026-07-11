<?php

namespace Tests\API;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Set standard headers for API consumption
        $this->withHeaders([
            'Accept' => 'application/json',
            'X-Requested-With' => 'XMLHttpRequest',
        ]);
    }
    
    /**
     * Helper to authenticate as a given user type.
     */
    protected function actAsAdmin()
    {
        // $user = User::factory()->create(['role' => 'admin']);
        // $this->actingAs($user, 'sanctum');
        // return $this;
    }
}
