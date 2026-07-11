<?php

namespace App\Modules\Automation\Actions;

use App\Core\Automation\WorkflowContext;
use App\Core\Notifications\NotificationRequest;
use App\Modules\Automation\Contracts\AutomationActionInterface;
use App\Modules\Automation\Models\WorkflowRun;
use App\Modules\Notifications\NotificationManager;

class NotificationAction implements AutomationActionInterface
{
    public function __construct(private NotificationManager $notificationManager) {}

    public function type(): string { return 'notification'; }

    public function execute(string $nodeId, array $config, WorkflowContext $context, WorkflowRun $run): array
    {
        $templateKey = $config['template_key'] ?? throw new \InvalidArgumentException('Missing template_key');
        $channels    = $config['channels'] ?? ['mail'];
        $recipientId = $config['recipient_id'] ?? $context->get('user_id');
        $contact     = $config['recipient_contact'] ?? $context->get('email');

        $request = new NotificationRequest(
            templateKey: $templateKey,
            payload: $context->toArray(),
            recipientId: $recipientId,
            recipientContact: $contact,
            channels: $channels
        );

        $this->notificationManager->send($request);

        return [
            'notification_dispatched' => true,
            'template' => $templateKey,
        ];
    }
}
