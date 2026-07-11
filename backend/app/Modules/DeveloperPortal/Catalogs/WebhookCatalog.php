<?php

namespace App\Modules\DeveloperPortal\Catalogs;

class WebhookCatalog
{
    /**
     * Defines the structure and payloads for all outbound Webhooks.
     * This is parsed to render the Stripe-style webhook documentation.
     */
    public function getAvailableWebhooks(): array
    {
        return [
            'lead.created' => [
                'description' => 'Triggered whenever a new lead is captured via the CRM module.',
                'method'      => 'POST',
                'headers'     => [
                    'X-Signature' => 'HMAC SHA-256 signature of the payload.',
                    'Content-Type'=> 'application/json',
                ],
                'retry_policy'=> 'Exponential backoff (1m, 5m, 15m, 1h). Fails after 4 attempts.',
                'payload_schema' => [
                    'event_id'   => 'string (uuid)',
                    'event_type' => 'string (lead.created)',
                    'created_at' => 'string (iso8601)',
                    'data'       => [
                        'lead_id' => 'string (uuid)',
                        'name'    => 'string',
                        'email'   => 'string',
                        'value'   => 'number',
                    ]
                ],
                'sample_json' => '{
                    "event_id": "evt_12345",
                    "event_type": "lead.created",
                    "created_at": "2026-07-11T12:00:00Z",
                    "data": {
                        "lead_id": "ld_9876",
                        "name": "John Doe",
                        "email": "john@example.com",
                        "value": 5000
                    }
                }'
            ],
            // Reserved: content.published, user.registered, automation.failed, etc.
        ];
    }
}
