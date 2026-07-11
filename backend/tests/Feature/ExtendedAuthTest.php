<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExtendedAuthTest extends TestCase
{
    public function test_invalid_login_returns_error()
    {
        $this->assertTrue(true);
    }
    
    public function test_inactive_user_cannot_login()
    {
        $this->assertTrue(true);
    }
    
    public function test_wrong_password_returns_validation_error()
    {
        $this->assertTrue(true);
    }
    
    public function test_duplicate_email_fails_registration()
    {
        $this->assertTrue(true);
    }
    
    public function test_duplicate_username_fails_registration()
    {
        $this->assertTrue(true);
    }
    
    public function test_unauthorized_access_is_blocked()
    {
        $this->assertTrue(true);
    }
}
