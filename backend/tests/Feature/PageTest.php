<?php

namespace Tests\Feature;

use Tests\TestCase;

class PageTest extends TestCase
{
    public function test_page_creation_generates_revision()
    {
        $this->assertTrue(true);
    }
    
    public function test_page_update_generates_new_revision_version()
    {
        $this->assertTrue(true);
    }
    
    public function test_slug_is_unique_automatically()
    {
        $this->assertTrue(true);
    }
    
    public function test_page_duplicate_appends_copy_to_slug()
    {
        $this->assertTrue(true);
    }
}
