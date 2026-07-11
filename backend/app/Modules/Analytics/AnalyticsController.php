<?php

namespace App\Modules\Analytics;

use App\Core\Analytics\AnalyticsContextBuilder;
use App\Core\Analytics\AnalyticsEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController
{
    public function __construct(
        private AnalyticsManager $manager,
        private AnalyticsContextBuilder $contextBuilder
    ) {}

    /**
     * GET /api/v1/analytics/config
     * Returns tracking snippet payload for Next.js to inject.
     */
    public function config(): JsonResponse
    {
        $driver = $this->manager->driver();

        return response()->json([
            'enabled' => $driver->isEnabled(),
            'driver'  => $driver->name(),
            'payload' => $driver->getScriptPayload(),
        ]);
    }

    /**
     * POST /api/v1/analytics/event
     * Frontend proxy for custom events (bypasses adblockers).
     * The event is validated, then dispatched via the AnalyticsManager to the queue.
     */
    public function event(Request $request): JsonResponse
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'category'   => 'nullable|string|max:255',
            'properties' => 'nullable|array',
            'value'      => 'nullable|numeric',
        ]);

        $event = new AnalyticsEvent(
            name:       $request->input('name'),
            category:   $request->input('category', 'general'),
            properties: $request->input('properties', []),
            value:      $request->input('value')
        );

        // Manually dispatch to inject the frontend's original context instead of relying
        // purely on the queue worker's environment.
        $context = $this->contextBuilder->build($request);
        
        // Dispatch to background queue
        dispatch(new Jobs\TrackAnalyticsEventJob('track', ['event' => $event], $context));

        return response()->json(['status' => 'queued']);
    }
}
