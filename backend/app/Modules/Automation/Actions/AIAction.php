<?php

namespace App\Modules\Automation\Actions;

use App\Core\Automation\WorkflowContext;
use App\Modules\Automation\Contracts\AutomationActionInterface;
use App\Modules\Automation\Models\WorkflowRun;

class AIAction implements AutomationActionInterface
{
    public function type(): string { return 'ai_action'; }

    public function execute(string $nodeId, array $config, WorkflowContext $context, WorkflowRun $run): array
    {
        // Reserved for future AI prompt execution (e.g. Lead Scoring)
        // Would integrate with OpenAI/Anthropic SDKs here.
        
        return [
            'ai_score' => rand(1, 100),
            'ai_summary' => 'Placeholder AI response.'
        ];
    }
}
