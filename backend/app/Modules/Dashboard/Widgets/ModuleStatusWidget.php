<?php

namespace App\Modules\Dashboard\Widgets;

use App\Core\Health\HealthCheckManager;
use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\File;

/**
 * Module Status Widget
 *
 * Auto-discovers all module.json files by scanning app/Modules/ and app/Core/.
 * No registration required — every new module appears automatically.
 *
 * For each module, reports:
 *   - name, version, namespace, description
 *   - installed:       module.json exists
 *   - provider_loaded: ServiceProvider is booted in the container
 *   - health:          from HealthCheckManager if a check is registered for this module
 */
class ModuleStatusWidget implements DashboardWidgetInterface
{
    public function __construct(private HealthCheckManager $health) {}

    public function key(): string   { return 'modules'; }
    public function label(): string { return 'Module Status'; }
    public function priority(): int { return 80; }
    public function cacheTtl(): int { return 300; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('system.monitor');
    }

    public function collect(): array
    {
        $modules    = [];
        $healthReport = $this->health->collect();

        // Group health results by group name for module matching
        $healthByGroup = [];
        foreach ($healthReport->results() as $result) {
            $healthByGroup[$result->group][] = $result->toArray();
        }

        // ── Scan both app/Modules/ and app/Core/ ──────────────────────────────
        $scanDirs = [
            app_path('Modules'),
            app_path('Core'),
        ];

        foreach ($scanDirs as $dir) {
            if (!is_dir($dir)) {
                continue;
            }

            foreach (File::directories($dir) as $moduleDir) {
                $manifestPath = $moduleDir . '/module.json';

                if (!File::exists($manifestPath)) {
                    continue;
                }

                $manifest = json_decode(File::get($manifestPath), true);

                if (!$manifest) {
                    continue;
                }

                $namespace       = $manifest['namespace'] ?? null;
                $providerClass   = $manifest['provider'] ?? null;
                $providerLoaded  = $providerClass ? $this->isProviderLoaded($providerClass) : false;

                // Map module namespace to health group
                // Convention: App\Modules\Search → 'search'  |  App\Core\Health → 'system'
                $groupHint  = strtolower(class_basename(rtrim($namespace ?? '', '\\')));
                $healthGroup = $healthByGroup[$groupHint] ?? null;

                $modules[] = [
                    'name'           => $manifest['name'] ?? basename($moduleDir),
                    'version'        => $manifest['version'] ?? '1.0',
                    'namespace'      => $namespace,
                    'description'    => $manifest['description'] ?? null,
                    'installed'      => true,
                    'provider_loaded'=> $providerLoaded,
                    'health'         => $healthGroup
                                        ? $this->aggregateHealth($healthGroup)
                                        : 'unknown',
                    'health_checks'  => $healthGroup ?? [],
                ];
            }
        }

        // Sort by name
        usort($modules, fn($a, $b) => strcmp($a['name'], $b['name']));

        return [
            'modules' => $modules,
            'total'   => count($modules),
            'healthy' => count(array_filter($modules, fn($m) => $m['health'] === 'ok')),
        ];
    }

    private function isProviderLoaded(string $providerClass): bool
    {
        try {
            return app()->getProvider($providerClass) !== null;
        } catch (\Throwable) {
            return false;
        }
    }

    private function aggregateHealth(array $checks): string
    {
        $statuses = array_column($checks, 'status');

        if (in_array('critical', $statuses)) return 'critical';
        if (in_array('warning', $statuses))  return 'warning';
        if (in_array('unknown', $statuses))  return 'unknown';

        return 'ok';
    }
}
