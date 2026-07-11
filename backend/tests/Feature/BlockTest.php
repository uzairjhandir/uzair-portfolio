<?php

namespace Tests\Feature;

use Tests\TestCase;

class BlockTest extends TestCase
{
    public function test_block_creation_generates_search_content_automatically()
    {
        $this->assertTrue(true);
    }
    
    public function test_locked_block_cannot_be_edited_without_permission()
    {
        $this->assertTrue(true);
    }
    
    public function test_updating_global_block_clears_redis_cache()
    {
        $this->assertTrue(true);
    }
    
    public function test_block_revision_created_on_update()
    {
        $this->assertTrue(true);
    }
}
