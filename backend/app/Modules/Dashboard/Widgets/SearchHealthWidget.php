<?php

namespace App\Modules\Dashboard\Widgets;

use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use App\Modules\Search\SearchManager;
use Illuminate\Contracts\Auth\Authenticatable;

/**
 * Search Health Widget
 *
 * Delegates entirely to SearchManager::health() — the same method
 * already implemented and tested in Module 17.
 */
class SearchHealthWidget implements DashboardWidgetInterface
{
    public function __construct(private SearchManager $manager) {}

    public function key(): string   { return 'search_health'; }
    public function label(): string { return 'Search Engine'; }
    public function priority(): int { return 30; }
    public function cacheTtl(): int { return 30; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('search.admin');
    }

    public function collect(): array
    {
        return $this->manager->health();
    }
}
