# Testing Guidelines

We prioritize **High Quality Reference Tests** over thousands of auto-generated low-value assertions.

## Target Coverage
* `Unit/`: Services, Repositories, DTOs.
* `Feature/`: End-to-end domain logic (e.g. creating a lead triggers an email).
* `Smoke/`: Post-deployment verifications against live environments.

## Running Tests
```bash
php artisan test
```
