<?php

namespace App\Modules\Production\Console;

use Illuminate\Console\Command;

class ProductionDoctorCommand extends Command
{
    protected $signature = 'production:doctor';
    protected $description = 'Runs a comprehensive suite of checks (audit, check, status) to ensure production readiness.';

    public function handle(): int
    {
        $this->info('Starting Enterprise Production Doctor...');

        $this->call('production:audit');
        $this->call('production:check');
        $this->call('production:status');
        
        $this->info('Doctor check complete.');

        return self::SUCCESS;
    }
}
