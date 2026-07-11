<?php

namespace App\Core\Automation\Enums;

enum NodeStatusEnum: string
{
    case RUNNING   = 'running';
    case SUCCESS   = 'success';
    case FAILED    = 'failed';
    case SKIPPED   = 'skipped';
}
