<?php

namespace App\Modules\Automation\Jobs;

use App\Modules\Automation\Models\WorkflowRun;
use App\Modules\Automation\WorkflowEngine;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EvaluateNodeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $queue = 'automation';

    public function __construct(
        public readonly int $workflowRunId,
        public readonly string $nodeId
    ) {}

    public function handle(WorkflowEngine $engine): void
    {
        $run = WorkflowRun::find($this->workflowRunId);

        if (!$run) {
            return;
        }

        $engine->executeNode($run, $this->nodeId);
    }
}
