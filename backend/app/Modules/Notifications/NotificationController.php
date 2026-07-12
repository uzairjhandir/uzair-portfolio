<?php

namespace App\Modules\Notifications;

use App\Core\Notifications\Enums\NotificationStatusEnum;
use App\Modules\Notifications\Models\NotificationLog;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController
{
    /**
     * GET /api/v1/admin/notifications
     * Minimal read-only delivery log viewer. No compose/send action exists —
     * this module is driven entirely by internal NotificationManager::send()
     * calls from other modules.
     */
    public function index(Request $request)
    {
        $logs = NotificationLog::query()
            ->when($request->query('status'), fn($q, $s) => $q->where('status', $s))
            ->when($request->query('channel'), fn($q, $c) => $q->where('channel', $c))
            ->when($request->query('search'), fn($q, $s) =>
                $q->where(fn($q2) => $q2->where('recipient_contact', 'like', "%{$s}%")
                                        ->orWhere('template_key', 'like', "%{$s}%"))
            )
            ->orderByDesc('created_at')
            ->paginate((int) $request->query('per_page', 25));

        return response()->json($logs);
    }

    /**
     * GET /api/v1/n/open/{uuid}
     * Returns a 1x1 transparent tracking pixel.
     */
    public function trackOpen(string $uuid): Response
    {
        $log = NotificationLog::where('uuid', $uuid)->first();

        if ($log && !$log->opened_at) {
            $log->update([
                'opened_at' => now(),
                'status'    => NotificationStatusEnum::OPENED->value,
            ]);
        }

        // Return 1x1 transparent GIF
        $pixel = base64_decode('R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==');

        return response($pixel, 200)
            ->header('Content-Type', 'image/gif')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    /**
     * GET /api/v1/n/click/{uuid}?url=https://...
     * Logs the click and redirects the user to the destination.
     */
    public function trackClick(string $uuid, Request $request)
    {
        $targetUrl = $request->query('url');

        if (!$targetUrl) {
            return response()->json(['error' => 'Missing target URL'], 400);
        }

        $log = NotificationLog::where('uuid', $uuid)->first();

        if ($log && !$log->clicked_at) {
            $log->update([
                'clicked_at' => now(),
                'status'     => NotificationStatusEnum::CLICKED->value,
            ]);
        }

        return redirect()->away($targetUrl);
    }
}
