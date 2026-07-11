<?php

namespace App\Modules\Analytics\Jobs;

use App\Core\Analytics\AnalyticsContext;
use App\Modules\Analytics\AnalyticsManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TrackAnalyticsEventJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Dispatch to the 'analytics' queue.
     */
    public $queue = 'analytics';

    public function __construct(
        public readonly string $method,
        public readonly array $arguments,
        public readonly AnalyticsContext $context
    ) {}

    public function handle(AnalyticsManager $manager): void
    {
        $driver = $manager->driver();
        
        if (!$driver->isEnabled()) {
            return;
        }

        // Add context to arguments
        $args = $this->arguments;
        $args['context'] = $this->context;

        // In a full implementation, if the driver supports batching, 
        // we might push this to a Redis list instead of calling the method directly.
        // For now, we execute the driver method immediately (S2S).
        
        call_user_func_array([$driver, $this->method], $args);
    }
}
