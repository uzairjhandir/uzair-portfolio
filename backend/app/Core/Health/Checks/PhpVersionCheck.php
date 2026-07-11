<?php

namespace App\Core\Health\Checks;

use App\Core\Health\Contracts\HealthCheckInterface;
use App\Core\Health\HealthCheckResult;

class PhpVersionCheck implements HealthCheckInterface
{
    private const MINIMUM_VERSION = '8.2.0';

    public function name(): string  { return 'php_version'; }
    public function label(): string { return 'PHP Version'; }
    public function group(): string { return 'system'; }

    public function run(): HealthCheckResult
    {
        $current = PHP_VERSION;
        $laravel = \Illuminate\Foundation\Application::VERSION;

        if (version_compare($current, self::MINIMUM_VERSION, '<')) {
            return HealthCheckResult::critical(
                "PHP {$current} is below minimum required " . self::MINIMUM_VERSION,
                ['php_version' => $current, 'minimum' => self::MINIMUM_VERSION, 'laravel_version' => $laravel]
            );
        }

        return HealthCheckResult::ok(
            "PHP {$current} — Laravel {$laravel}",
            ['php_version' => $current, 'minimum' => self::MINIMUM_VERSION, 'laravel_version' => $laravel]
        );
    }
}
