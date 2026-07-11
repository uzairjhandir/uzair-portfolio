<?php

namespace App\Core\Analytics;

/**
 * Analytics Result Enum
 */
enum AnalyticsResult: string
{
    case SUCCESS = 'success';
    case DROPPED = 'dropped';
    case FAILED  = 'failed';
}
