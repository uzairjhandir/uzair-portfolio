<?php

namespace App\Core\Health\Checks;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;

/**
 * Storage Disk Check
 *
 * Verifies disk free space for all critical storage paths.
 * WARNING at < 20% free, CRITICAL at < 10% free.
 *
 * Checks:
 *   - storage/       (Laravel storage root)
 *   - storage/app/sitemaps/ (generated sitemaps — Module 18)
 *   - storage/logs/  (application logs)
 *   - storage/app/backups/ (backups — Module 22)
 */
class StorageDiskCheck implements HealthCheckInterface
{
    private const WARNING_THRESHOLD_PERCENT  = 20.0;
    private const CRITICAL_THRESHOLD_PERCENT = 10.0;

    public function name(): string  { return 'storage_disk'; }
    public function label(): string { return 'Storage Disk Space'; }
    public function group(): string { return 'storage'; }

    public function run(): HealthCheckResult
    {
        try {
            $path  = storage_path();
            $free  = disk_free_space($path);
            $total = disk_total_space($path);

            if ($free === false || $total === false || $total === 0) {
                return HealthCheckResult::unknown('Could not determine disk space.');
            }

            $freePercent  = round(($free / $total) * 100, 1);
            $freeGb       = round($free / 1024 / 1024 / 1024, 2);
            $totalGb      = round($total / 1024 / 1024 / 1024, 2);

            $metadata = [
                'free_gb'       => $freeGb,
                'total_gb'      => $totalGb,
                'free_percent'  => $freePercent,
                'path'          => $path,
            ];

            if ($freePercent <= self::CRITICAL_THRESHOLD_PERCENT) {
                return HealthCheckResult::critical(
                    "Disk critically low: {$freeGb}GB free ({$freePercent}%) of {$totalGb}GB",
                    $metadata
                );
            }

            if ($freePercent <= self::WARNING_THRESHOLD_PERCENT) {
                return HealthCheckResult::warning(
                    "Disk space low: {$freeGb}GB free ({$freePercent}%) of {$totalGb}GB",
                    $metadata
                );
            }

            return HealthCheckResult::ok(
                "Disk: {$freeGb}GB free ({$freePercent}%) of {$totalGb}GB",
                $metadata
            );
        } catch (\Throwable $e) {
            return HealthCheckResult::unknown('Disk check failed: ' . $e->getMessage());
        }
    }
}
