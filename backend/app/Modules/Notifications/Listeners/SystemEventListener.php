<?php

namespace App\Modules\Notifications\Listeners;

use App\Core\Notifications\NotificationRequest;
use App\Modules\Notifications\NotificationManager;

/**
 * System Event Listener
 * 
 * Implements the "Event Bus" approach. Catches domain events from other 
 * modules (like CRM, Newsletter) and translates them into Notification Requests.
 */
class SystemEventListener
{
    public function __construct(private NotificationManager $manager) {}

    public function handleLeadCreated($event): void
    {
        // $event->contact contains the CRM contact data

        $this->manager->send(new NotificationRequest(
            templateKey: 'admin_lead_created_alert',
            payload: [
                'name'  => $event->contact->first_name . ' ' . $event->contact->last_name,
                'email' => $event->contact->email,
                'value' => $event->contact->lead_value ?? 0,
            ],
            // Hardcode to system admins for this alert, but ideally fetched from a rule engine
            recipientContact: config('mail.from.address'),
            channels: ['mail', 'slack']
        ));
    }
}
