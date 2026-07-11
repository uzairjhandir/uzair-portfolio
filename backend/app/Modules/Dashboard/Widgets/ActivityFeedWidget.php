<?php

namespace App\Modules\Dashboard\Widgets;

use App\Modules\Dashboard\Contracts\DashboardWidgetInterface;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\DB;

/**
 * Activity Feed Widget
 *
 * Unified activity stream from content_activity_logs.
 * Surfaces the 20 most recent events across all content types and actors.
 *
 * Action labels are human-readable for the admin UI.
 */
class ActivityFeedWidget implements DashboardWidgetInterface
{
    public function key(): string   { return 'activity'; }
    public function label(): string { return 'Recent Activity'; }
    public function priority(): int { return 60; }
    public function cacheTtl(): int { return 30; }

    public function visibleFor(Authenticatable $user): bool
    {
        return $user->can('dashboard.view');
    }

    public function collect(): array
    {
        $entries = DB::table('content_activity_logs as a')
            ->leftJoin('users as u', 'u.id', '=', 'a.causer_id')
            ->orderByDesc('a.created_at')
            ->limit(20)
            ->select([
                'a.id',
                'a.log_name',
                'a.description as action',
                'a.subject_type',
                'a.subject_id',
                'a.properties',
                'a.created_at',
                DB::raw("CONCAT(u.name) as actor"),
            ])
            ->get()
            ->map(function ($entry) {
                $properties = json_decode($entry->properties ?? '{}', true);

                return [
                    'id'           => $entry->id,
                    'action'       => $entry->action,
                    'subject_type' => class_basename($entry->subject_type ?? ''),
                    'subject_id'   => $entry->subject_id,
                    'subject_label'=> $properties['attributes']['title'] ?? null,
                    'actor'        => $entry->actor,
                    'log_name'     => $entry->log_name,
                    'at'           => $entry->created_at,
                ];
            });

        return [
            'entries' => $entries->toArray(),
            'total'   => DB::table('content_activity_logs')->count(),
        ];
    }
}
