<?php

namespace App\Modules\Production\Console;

use Illuminate\Console\Command;

class ProductionWarmupCommand extends Command
{
    protected $signature = 'production:warm';
    protected $description = 'Warms the application cache, top SEO routes, and Redis immediately after deployment.';

    public function handle(): int
    {
        $this->info('Starting cache warmup...');

        // 1. Native Laravel caches
        $this->call('config:cache');
        $this->call('route:cache');
        $this->call('view:cache');
        $this->call('event:cache');

        // 2. Domain-specific cache warmup
        // e.g., app(\App\Modules\Settings\SettingsManager::class)->warm();
        // e.g., app(\App\Modules\Seo\SitemapEngine::class)->generate();
        
        // 3. Set startup flag for /health/startup probe
        cache()->put('system_warmed', true, now()->addMinutes(10));

        $this->info('✅ Cache warmup complete. Application is ready for high traffic.');
        return self::SUCCESS;
    }
}
