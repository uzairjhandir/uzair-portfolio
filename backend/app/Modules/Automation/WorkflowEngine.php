<?php

namespace App\Modules\Automation;

use App\Core\Automation\Enums\RunStatusEnum;
use App\Core\Automation\WorkflowContext;
use App\Modules\Automation\Jobs\EvaluateNodeJob;
use App\Modules\Automation\Models\WorkflowRun;
use Illuminate\Support\Facades\Log;

class WorkflowEngine
{
    public function __construct(private ActionRegistry $registry) {}

    /**
     * Start a new workflow run from its initial node.
     */
    public function startRun(WorkflowRun $run): void
    {
        $run->update(['status' => RunStatusEnum::RUNNING->value, 'started_at' => now()]);

        $definition = $run->version->definition;
        
        // Assuming the JSON definition has a 'start_node' identifier
        $startNodeId = $definition['start_node'] ?? null;

        if ($startNodeId) {
            dispatch(new EvaluateNodeJob($run->id, $startNodeId));
        } else {
            $this->completeRun($run, RunStatusEnum::FAILED, 'No start node defined.');
        }
    }

    /**
     * Resumes a paused workflow (e.g., after a WaitAction or manual approval).
     */
    public function resumeRun(WorkflowRun $run): void
    {
        $run->update(['status' => RunStatusEnum::RUNNING->value, 'resume_at' => null]);
        
        // Note: A more complex engine would track exactly which node paused the run 
        // in a separate state column, then dispatch EvaluateNodeJob for the NEXT node.
        // For the sake of this architectural skeleton, we log the resumption.
        Log::info("Automation Run {$run->uuid} resumed.");
    }

    /**
     * Executes a single node, merges output into context, and routes to the next node(s).
     */
    public function executeNode(WorkflowRun $run, string $nodeId): void
    {
        if ($run->status !== RunStatusEnum::RUNNING->value) {
            return;
        }

        $definition = $run->version->definition;
        $nodes = $definition['nodes'] ?? [];
        $edges = $definition['edges'] ?? [];

        if (!isset($nodes[$nodeId])) {
            $this->completeRun($run, RunStatusEnum::FAILED, "Node {$nodeId} not found in definition.");
            return;
        }

        $nodeConfig = $nodes[$nodeId];
        $actionType = $nodeConfig['type']; // e.g. 'webhook', 'wait', 'condition'

        try {
            $action = $this->registry->get($actionType);
            $context = new WorkflowContext($run->context ?? []);

            $startTime = microtime(true);
            
            // Execute the Plugin
            $output = $action->execute($nodeId, $nodeConfig, $context, $run);
            
            $durationMs = (int)((microtime(true) - $startTime) * 1000);

            // Log Result
            $run->context = array_merge($run->context ?? [], $output);
            $run->save();

            \App\Modules\Automation\Models\ActionResult::create([
                'run_id'      => $run->id,
                'node_id'     => $nodeId,
                'action_type' => $actionType,
                'status'      => 'success',
                'output'      => $output,
                'duration_ms' => $durationMs,
                'completed_at'=> now(),
            ]);

            // If the action paused the workflow (WaitAction), halt traversal.
            if ($run->fresh()->status === RunStatusEnum::PAUSED->value) {
                return;
            }

            $this->routeNextNodes($run, $nodeId, $output, $edges);

        } catch (\Throwable $e) {
            \App\Modules\Automation\Models\ActionResult::create([
                'run_id'      => $run->id,
                'node_id'     => $nodeId,
                'action_type' => $actionType,
                'status'      => 'failed',
                'exception'   => $e->getMessage(),
                'completed_at'=> now(),
            ]);

            $this->completeRun($run, RunStatusEnum::FAILED, $e->getMessage());
        }
    }

    private function routeNextNodes(WorkflowRun $run, string $currentNodeId, array $output, array $edges): void
    {
        // Find outgoing edges from this node
        $nextEdges = array_filter($edges, fn($edge) => $edge['from'] === $currentNodeId);

        if (empty($nextEdges)) {
            $this->completeRun($run, RunStatusEnum::COMPLETED);
            return;
        }

        foreach ($nextEdges as $edge) {
            // Check condition routing (e.g. True/False branch from ConditionNode)
            if (isset($edge['condition_value'])) {
                $actualValue = $output['condition_result'] ?? null;
                if ($actualValue !== $edge['condition_value']) {
                    continue; // Skip this branch
                }
            }

            dispatch(new EvaluateNodeJob($run->id, $edge['to']));
        }
    }

    private function completeRun(WorkflowRun $run, RunStatusEnum $status, ?string $error = null): void
    {
        $run->update([
            'status'       => $status->value,
            'completed_at' => now(),
        ]);

        if ($error) {
            \App\Modules\Automation\Models\AutomationLog::create([
                'run_id'  => $run->id,
                'level'   => 'error',
                'message' => "Run ended with error: {$error}",
            ]);
        }
    }
}
