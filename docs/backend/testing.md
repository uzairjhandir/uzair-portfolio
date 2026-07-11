# Testing Architecture

To ensure the backend behaves exactly as the React Admin expects, the Laravel implementation will enforce strict API testing.

## Test Suite
- **Framework**: PHPUnit / Pest PHP
- **Coverage Goal**: 80% minimum on Http Controllers and Services.

## Testing Strategy

### 1. Feature Tests (API Contracts)
Every endpoint documented in `api-specification.md` must have a corresponding Feature Test.
Example:
```php
public function test_admin_can_create_blog_post()
{
    $admin = User::factory()->create()->assignRole('admin');
    
    $response = $this->actingAs($admin)->postJson('/api/v1/blogs', [
        'title' => 'Test Post',
        'slug' => 'test-post'
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['success', 'data', 'meta']);
}
```

### 2. Unit Tests
- Business logic in `Actions` and `Services` will be tested in isolation using mocks for `Repositories`.

### 3. CI/CD Integration
- GitHub Actions will run `php artisan test` on every Pull Request. Code cannot be merged if tests fail or if the JSON shape changes and breaks the frontend contract.
