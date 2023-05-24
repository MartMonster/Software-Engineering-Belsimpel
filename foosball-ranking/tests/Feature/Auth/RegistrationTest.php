<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test',
            'lastname' => 'User',
            'username' => 'testUser',
            'email' => 'test@belsimpel.nl',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertNoContent();
    }

    public function test_new_users_cannot_register_with_invalid_email(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test',
            'lastname' => 'User',
            'username' => 'testUser',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors(['email']);
    }
}
