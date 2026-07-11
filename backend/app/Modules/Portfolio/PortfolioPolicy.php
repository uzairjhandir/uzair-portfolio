<?php

namespace App\Modules\Portfolio;

use App\Policies\AbstractContentPolicy;
use App\Models\User;

class PortfolioPolicy extends AbstractContentPolicy
{
    // All standard permissions inherited.
    // Portfolio has no unique authorization rules beyond what Core provides.
}
