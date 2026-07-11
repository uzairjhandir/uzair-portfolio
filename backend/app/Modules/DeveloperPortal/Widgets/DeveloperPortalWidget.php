<?php

namespace App\Modules\DeveloperPortal\Widgets;

use App\Modules\Dashboard\Widgets\AbstractDashboardWidget;
use Illuminate\Contracts\Auth\Authenticatable;

class DeveloperPortalWidget extends AbstractDashboardWidget
{
    public function key(): string   { return 'developer_portal'; }
    public function label(): string { return 'Developer Portal & API'; }
    public function priority(): int { return 70; }
    public function cacheTtl(): int { return 3600; }
    public function icon(): string  { return 'code'; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('system.developer');
    }

    public function collect(): array
    {
        $specPath = storage_path('app/openapi_v1.json');
        $specVersion = 'Unknown';
        $endpointsCount = 0;
        $deprecatedCount = 0;

        if (file_exists($specPath)) {
            $spec = json_decode(file_get_contents($specPath), true);
            $specVersion = $spec['info']['version'] ?? 'Unknown';
            
            foreach ($spec['paths'] ?? [] as $path => $methods) {
                foreach ($methods as $method => $details) {
                    $endpointsCount++;
                    if (isset($details['deprecated']) && $details['deprecated'] === true) {
                        $deprecatedCount++;
                    }
                }
            }
        }

        return [
            'period'  => 'Live Snapshot',
            'metrics' => [
                'api_version'   => $specVersion,
                'endpoints'     => $endpointsCount,
                'deprecated'    => $deprecatedCount,
                'sdks_built'    => 3, // Simulated (TypeScript, PHP, Python)
            ],
            'health' => [
                'swagger_ui'    => 'Online',
                'redoc'         => 'Online',
            ]
        ];
    }
}
