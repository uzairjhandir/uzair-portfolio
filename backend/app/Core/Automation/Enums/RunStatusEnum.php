<?php

namespace App\Core\Automation\Enums;

enum RunStatusEnum: string
{
    case WAITING   = 'waiting';
    case RUNNING   = 'running';
    case PAUSED    = 'paused';    // e.g., waiting for WaitAction or human approval
    case RETRYING  = 'retrying';
    case SKIPPED   = 'skipped';   // e.g., condition evaluates to false at root
    case CANCELLED = 'cancelled';
    case COMPLETED = 'completed'; // Graph traversed successfully
    case FAILED    = 'failed';    // Unrecoverable error in graph
    case EXPIRED   = 'expired';
}
