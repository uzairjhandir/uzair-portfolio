<?php

namespace Tests\Smoke;

class ProductionHealthTest extends SmokeTestCase
{
    /**
     * @test
     */
    public function it_returns_200_on_liveness_probe()
    {
        $response = $this->get('/api/health/live');
        $response->assertStatus(200);
        $response->assertJson(['status' => 'ok']);
    }

    /**
     * @test
     */
    public function it_successfully_connects_to_database_and_redis()
    {
        $response = $this->get('/api/health/ready');
        $response->assertStatus(200);
        $response->assertJson(['status' => 'ok']);
    }
}
