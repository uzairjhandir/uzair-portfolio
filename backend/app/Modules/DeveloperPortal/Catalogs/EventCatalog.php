<?php

namespace App\Modules\DeveloperPortal\Catalogs;

class EventCatalog
{
    /**
     * Auto-discovers and documents internal Domain Events.
     * In a full implementation, this could parse module.json files to map 'events_listened' 
     * to 'events_fired'.
     */
    public function getInternalEvents(): array
    {
        return [
            'App\Events\LeadCreated' => [
                'producer'  => 'CRM Module',
                'consumers' => ['Notifications Module', 'Automation Engine'],
                'queue'     => 'sync (Event fired synchronously, listeners are queued)',
                'payload'   => 'App\Modules\Crm\Models\Contact $contact',
            ],
            'App\Events\ContentPublished' => [
                'producer'  => 'Content Engine',
                'consumers' => ['Search Module', 'Analytics Engine', 'SEO Module'],
                'queue'     => 'sync',
                'payload'   => 'App\Core\Content\Models\ContentModel $content',
            ],
        ];
    }
}
