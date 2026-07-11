<?php

namespace App\Modules\Automation\Contracts;

use App\Core\Automation\WorkflowContext;
use App\Modules\Automation\Models\WorkflowRun;

interface AutomationActionInterface
{
    /**
     * Machine name for the node type (e.g. 'wait_action', 'notification_action', 'condition_node')
     */
    public function type(): string;

    /**
     * Execute the node's logic.
     * Return an array of output variables to merge into the WorkflowContext.
     * 
     * @param string $nodeId The specific UUID of the node in the definition graph
     * @param array $config The node-specific configuration from the definition JSON
     * @param WorkflowContext $context The current running state
     * @param WorkflowRun $run The database model of the run (useful if the node needs to pause the run)
     * 
     * @return array
     */
    public function execute(string $nodeId, array $config, WorkflowContext $context, WorkflowRun $run): array;
}
