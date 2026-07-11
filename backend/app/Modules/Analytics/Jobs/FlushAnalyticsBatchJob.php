<?php

namespace App\Modules\Analytics\Jobs;

use App\Core\Analytics\AnalyticsBatch;
use App\Modules\Analytics\AnalyticsManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

class FlushAnalyticsBatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $queue = 'analytics';

    public function handle(AnalyticsManager $manager): void
    {
        $driver = $manager->driver();
        
        if (!$driver->isEnabled()) {
            return;
        }

        // Example implementation for Redis batching:
        // Pop up to 100 events from the redis list
        
        $redisKey = 'analytics:batch:' . $driver->name();
        $batch = new AnalyticsBatch();
        
        // This is a basic illustration. A real implementation would use LPOP with count
        // or a lua script for atomicity.
        for ($i = 0; $i < 100; $i++) {
            $payload = Redis::lpop($redisKey);
            if (!$payload) break;
            
            $data = unserialize($payload);
            $batch->add($data['event'], $data['context']);
        }

        if ($batch->count() > 0) {
            $driver->flush($batch);
        }
    }
}
