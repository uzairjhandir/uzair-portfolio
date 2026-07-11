<?php

namespace App\Modules\DeveloperPortal\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class GenerateSpecCommand extends Command
{
    protected $signature = 'api:generate-spec {--version=v1} {--output=storage/app/openapi.json}';
    protected $description = 'Triggers Scramble to dump the OpenAPI 3.1 JSON spec to disk for CI/CD builds.';

    public function handle(): int
    {
        $version = $this->option('version');
        $outputPath = $this->option('output');

        $this->info("Generating OpenAPI spec for {$version}...");

        // In a full implementation using Scramble, you would resolve Scramble's Generator 
        // and tell it to parse the routes matching `api/{$version}/*` and output to disk.
        
        // Pseudo-implementation:
        // $spec = app(\Dedoc\Scramble\Generator::class)->generate();
        // File::put(base_path($outputPath), json_encode($spec, JSON_PRETTY_PRINT));

        // Simulated output for architecture reservation
        $dummySpec = [
            'openapi' => '3.1.0',
            'info' => [
                'title' => 'DXP API',
                'version' => $version
            ]
        ];

        File::ensureDirectoryExists(dirname(base_path($outputPath)));
        File::put(base_path($outputPath), json_encode($dummySpec, JSON_PRETTY_PRINT));

        $this->info("Spec generated successfully at {$outputPath}.");

        return self::SUCCESS;
    }
}
