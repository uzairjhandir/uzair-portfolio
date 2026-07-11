<?php

namespace App\Core\Notifications\Enums;

enum NotificationStatusEnum: string
{
    case QUEUED    = 'queued';
    case SENDING   = 'sending';
    case DELIVERED = 'delivered';
    case OPENED    = 'opened';
    case CLICKED   = 'clicked';
    case FAILED    = 'failed';
    case RETRIED   = 'retried';
    case CANCELLED = 'cancelled';
}
