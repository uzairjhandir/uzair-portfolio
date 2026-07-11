<?php

namespace App\Modules\Automation\Actions;

use App\Core\Automation\WorkflowContext;
use App\Modules\Automation\Contracts\AutomationActionInterface;
use App\Modules\Automation\Models\WorkflowRun;

class ConditionNode implements AutomationActionInterface
{
    public function type(): string { return 'condition'; }

    public function execute(string $nodeId, array $config, WorkflowContext $context, WorkflowRun $run): array
    {
        $expression = $config['expression'] ?? 'false';
        
        // Very basic evaluator placeholder. In a true enterprise system,
        // use symfony/expression-language here to evaluate $expression securely.
        // e.g. return ['condition_result' => $expressionLanguage->evaluate($expression, $context->toArray())];
        
        // For now, we simulate success if the expression isn't strictly 'false'
        $result = ($expression !== 'false');

        return [
            'condition_result' => $result
        ];
    }
}
