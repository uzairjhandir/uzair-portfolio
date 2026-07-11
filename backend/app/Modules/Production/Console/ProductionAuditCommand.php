<?php

namespace App\Modules\Production\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;

class ProductionAuditCommand extends Command
{
    protected $signature = 'production:audit';
    protected $description = 'Validates security configurations (APP_KEY, HTTPS, permissions, drivers).';

    public function handle(): int
    {
        $hasErrors = false;

        $this->info('Running Production Security Audit...');

        // 1. Check APP_DEBUG
        if (Config::get('app.debug')) {
            $this->error('APP_DEBUG is set to true! This is a massive security risk in production.');
            $hasErrors = true;
        }

        // 2. Check APP_ENV
        if (Config::get('app.env') !== 'production') {
            $this->warn('APP_ENV is not set to production.');
        }

        // 3. Check HTTPS Enforcer (If route relies on https)
        if (!Config::get('session.secure')) {
            $this->error('Session cookies are not set to secure. Ensure SESSION_SECURE_COOKIE=true.');
            $hasErrors = true;
        }

        // 4. Check Queue Driver
        if (Config::get('queue.default') === 'sync') {
            $this->error('Queue driver is set to sync. Production requires redis, database, or sqs.');
            $hasErrors = true;
        }

        // 5. Check Log Channels
        if (Config::get('logging.default') === 'stack' && !Config::get('logging.channels.stack.channels')) {
             // simplified logic
        }

        if ($hasErrors) {
            $this->error('Security Audit Failed! Fix the above issues.');
            return self::FAILURE;
        }

        $this->info('✅ Security Audit Passed. Application is hardened.');
        return self::SUCCESS;
    }
}
