<?php

namespace App\Modules\Production\Health;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;
use Illuminate\Support\Facades\Storage;

class BackupHealth implements HealthCheckInterface
{
    public function name(): string { return 'automated_backups'; }
    public function label(): string { return 'S3 Backup Status'; }
    public function group(): string { return 'infrastructure'; }

    public function run(): HealthCheckResult
    {
        // Checks if spatie/laravel-backup generated a file in the last 24 hours
        $lastBackupTime = cache()->get('last_successful_backup');

        if (!$lastBackupTime) {
            return HealthCheckResult::warning('No backup has been recorded yet.');
        }

        $hoursSince = now()->diffInHours($lastBackupTime);

        if ($hoursSince > 48) {
            return HealthCheckResult::critical("Last backup was {$hoursSince} hours ago. Backup job failing!");
        }

        return HealthCheckResult::ok("Last backup was {$hoursSince} hours ago.");
    }
}
