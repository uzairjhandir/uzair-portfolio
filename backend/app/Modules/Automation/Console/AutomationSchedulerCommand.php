<?php

namespace App\Modules\Automation\Console;

use App\Core\Automation\Enums\RunStatusEnum;
use App\Modules\Automation\Models\WorkflowRun;
use App\Modules\Automation\WorkflowEngine;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class AutomationSchedulerCommand extends Command
{
    protected $signature = 'automation:schedule';
    protected $description = 'Evaluates scheduled triggers and resumes paused workflows (WaitActions). Should run every minute.';

    public function handle(WorkflowEngine $engine): int
    {
        // 1. Resume paused workflows that have reached their resume_at time
        $pausedRuns = WorkflowRun::where('status', RunStatusEnum::PAUSED->value)
            ->whereNotNull('resume_at')
            ->where('resume_at', '<=', now())
            ->get();

        foreach ($pausedRuns as $run) {
            $engine->resumeRun($run);
            $this->info("Resumed Run {$run->uuid}");
        }

        // 2. Evaluate Cron Triggers (Conceptual Reservation)
        // A complete implementation would query `automation_workflows` for active workflows
        // with cron triggers, evaluate if they are due using cron-expression library,
        // and create new WorkflowRuns.
        
        // Log heartbeat
        Log::debug('AutomationScheduler executed.');

        return self::SUCCESS;
    }
}
