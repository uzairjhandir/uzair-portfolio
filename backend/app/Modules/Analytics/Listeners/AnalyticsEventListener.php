<?php

namespace App\Modules\Analytics\Listeners;

use App\Core\Analytics\AnalyticsEvent;
use App\Modules\Analytics\AnalyticsManager;

/**
 * Analytics Event Listener
 * 
 * Automatically intercepts core application events and translates them 
 * into AnalyticsEvents to be queued.
 */
class AnalyticsEventListener
{
    public function __construct(private AnalyticsManager $manager) {}

    public function handlePublished($event): void
    {
        $this->manager->track(new AnalyticsEvent(
            name: 'content_published',
            category: 'content',
            properties: [
                'uuid' => $event->content->uuid,
                'type' => class_basename($event->content),
            ]
        ));
    }

    public function handleDownload($event): void
    {
        $this->manager->track(new AnalyticsEvent(
            name: 'download_completed',
            category: 'downloads',
            properties: [
                'download_uuid' => $event->download->uuid,
                'file_name'     => $event->download->file_name,
            ]
        ));
    }

    public function handleSearch($event): void
    {
        $this->manager->track(new AnalyticsEvent(
            name: 'search_executed',
            category: 'search',
            properties: [
                'query'       => $event->query->searchTerm(),
                'result_count'=> $event->results->total(),
            ]
        ));
    }
}
