<?php

namespace App\Modules\Dashboard\Widgets;

use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

/**
 * Storage Widget
 *
 * Breakdown of disk space usage across all storage categories.
 * Uses PHP filesystem functions — no shell commands.
 *
 * Sources:
 *   Media files → media table SUM(size) (accurate, no filesystem walk)
 *   Sitemaps    → file system scan (small directory)
 *   Logs        → file system scan
 *   Backups     → file system scan (reserved for Module 22)
 *   Database    → INFORMATION_SCHEMA query
 */
class StorageWidget implements DashboardWidgetInterface
{
    public function key(): string   { return 'storage'; }
    public function label(): string { return 'Storage'; }
    public function priority(): int { return 70; }
    public function cacheTtl(): int { return 120; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('system.monitor');
    }

    public function collect(): array
    {
        // ── Media (from DB — fastest, no disk walk) ───────────────────────────
        $mediaBytes = (int) DB::table('media')->sum('size');

        // ── Filesystem paths ──────────────────────────────────────────────────
        $logBytes      = $this->dirSize(storage_path('logs'));
        $sitemapBytes  = $this->dirSize(storage_path('app/sitemaps'));
        $backupBytes   = $this->dirSize(storage_path('app/backups'));

        // ── Database size (MySQL/MariaDB) ─────────────────────────────────────
        $dbName  = config('database.connections.' . config('database.default') . '.database');
        $dbBytes = 0;

        try {
            $result = DB::selectOne("
                SELECT SUM(data_length + index_length) as size
                FROM information_schema.TABLES
                WHERE table_schema = ?
            ", [$dbName]);

            $dbBytes = (int) ($result->size ?? 0);
        } catch (\Throwable) {
            // Non-MySQL driver — skip gracefully
        }

        return [
            'breakdown' => [
                'media'    => $this->format($mediaBytes),
                'logs'     => $this->format($logBytes),
                'sitemaps' => $this->format($sitemapBytes),
                'backups'  => $this->format($backupBytes),
                'database' => $this->format($dbBytes),
            ],
            'total'        => $this->format($mediaBytes + $logBytes + $sitemapBytes + $backupBytes + $dbBytes),
            'media_files'  => (int) DB::table('media')->count(),
        ];
    }

    private function dirSize(string $path): int
    {
        if (!is_dir($path)) {
            return 0;
        }

        $size  = 0;
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($files as $file) {
            $size += $file->getSize();
        }

        return $size;
    }

    private function format(int $bytes): array
    {
        $gb = round($bytes / 1024 / 1024 / 1024, 3);
        $mb = round($bytes / 1024 / 1024, 1);

        return [
            'bytes' => $bytes,
            'mb'    => $mb,
            'gb'    => $gb,
            'label' => $gb >= 1 ? "{$gb} GB" : "{$mb} MB",
        ];
    }
}
