<?php

namespace App\Modules\Automation\Actions;

use App\Core\Automation\WorkflowContext;
use App\Core\Automation\Enums\RunStatusEnum;
use App\Modules\Automation\Contracts\AutomationActionInterface;
use App\Modules\Automation\Models\WorkflowRun;

class WaitAction implements AutomationActionInterface
{
    public function type(): string { return 'wait'; }

    public function execute(string $nodeId, array $config, WorkflowContext $context, WorkflowRun $run): array
    {
        // Example Config: ['delay_seconds' => 300]
        $delaySeconds = $config['delay_seconds'] ?? 60;
        
        $run->update([
            'status'    => RunStatusEnum::PAUSED->value,
            'resume_at' => now()->addSeconds($delaySeconds),
        ]);

        return [
            'wait_until' => now()->addSeconds($delaySeconds)->toDateTimeString()
        ];
    }
}
