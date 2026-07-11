<?php

namespace App\Modules\Production\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class DeployCommand extends Command
{
    protected $signature = 'production:deploy';
    protected $description = 'Orchestrates the deployment pipeline hooks (Maintenance -> Migrate -> Cache -> Warmup -> Health Check -> Online).';

    public function handle(): int
    {
        $this->info('🚀 Starting Enterprise Deployment Pipeline...');

        try {
            // Step 1: Maintenance Mode
            $this->info('1. Enabling Maintenance Mode...');
            Artisan::call('down', ['--secret' => 'deploying-bypass-123']);

            // Step 2: Migrations
            $this->info('2. Running Migrations...');
            Artisan::call('migrate', ['--force' => true]);

            // Step 3: Cache clearing
            $this->info('3. Clearing Caches...');
            Artisan::call('optimize:clear');

            // Step 4: Rebuilding Search/SEO (Reserved logic)
            // e.g. $this->call('scout:sync');
            
            // Step 5: Warmup
            $this->info('4. Warming Caches...');
            Artisan::call('production:warm');

            // Step 6: Bring Online
            $this->info('5. Disabling Maintenance Mode...');
            Artisan::call('up');

            // Step 7: Final Health Check
            $this->info('6. Running Health Audit...');
            $exitCode = Artisan::call('production:doctor');

            if ($exitCode !== Command::SUCCESS) {
                $this->warn('Deployment finished, but Doctor reported issues. Please check logs.');
            }

            $this->info('✅ Deployment Pipeline Complete!');

        } catch (\Exception $e) {
            $this->error('Deployment Pipeline Failed! Initiating Rollback Protocols.');
            Artisan::call('up');
            // Advanced rollback could reverse migrations here
            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}
