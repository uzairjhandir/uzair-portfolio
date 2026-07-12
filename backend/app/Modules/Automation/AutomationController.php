<?php

namespace App\Modules\Automation;

use App\Http\Controllers\Controller;
use App\Modules\Automation\Models\Workflow;
use App\Modules\Automation\Models\WorkflowVersion;
use App\Modules\Automation\Models\WorkflowRun;
use App\Modules\Automation\Models\ActionResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Automation controller — plain Controller, not AbstractContentController
 * (Workflow has no publish/schedule/SEO/taxonomy concept, it's a graph
 * definition + run history, not a content type).
 *
 * Scope: workflow metadata CRUD + immutable version publishing (raw JSON
 * definition — a visual node/edge builder is out of scope for this phase)
 * + read-only run/action-result monitoring. No new workflow engine was
 * built; WorkflowEngine/ActionRegistry/EvaluateNodeJob are reused as-is.
 */
class AutomationController extends Controller
{
    /** GET /automation/workflows */
    public function index(Request $request)
    {
        $query = Workflow::with('latestVersion')->withCount('runs');

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }
        if ($request->query('is_active') !== null) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $items = $query->orderByDesc('created_at')->paginate((int) $request->query('per_page', 15));
        return response()->json($items);
    }

    /** GET /automation/workflows/{uuid} */
    public function show(string $uuid)
    {
        $workflow = Workflow::where('uuid', $uuid)->with('latestVersion')->withCount('runs')->firstOrFail();
        return response()->json($workflow);
    }

    /** POST /automation/workflows */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active'   => 'nullable|boolean',
        ]);
        $workflow = Workflow::create($data);
        return response()->json($workflow, 201);
    }

    /** PUT /automation/workflows/{uuid} */
    public function update(Request $request, string $uuid)
    {
        $workflow = Workflow::where('uuid', $uuid)->firstOrFail();
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_active'   => 'nullable|boolean',
        ]);
        $workflow->update($data);
        return response()->json($workflow->fresh('latestVersion'));
    }

    /** DELETE /automation/workflows/{uuid} */
    public function destroy(string $uuid)
    {
        $workflow = Workflow::where('uuid', $uuid)->firstOrFail();
        $workflow->delete();
        return response()->json(['message' => 'Workflow deleted.']);
    }

    /**
     * POST /automation/workflows/{uuid}/versions
     * Publishes a new immutable version. Versions are append-only —
     * matches the "Immutable Definitions" comment on the migration.
     */
    public function publishVersion(Request $request, string $uuid)
    {
        $workflow = Workflow::where('uuid', $uuid)->firstOrFail();
        $data = $request->validate([
            'definition' => 'required|array',
        ]);

        $nextVersion = ($workflow->versions()->max('version') ?? 0) + 1;

        $version = WorkflowVersion::create([
            'workflow_id'   => $workflow->id,
            'version'       => $nextVersion,
            'definition'    => $data['definition'],
            'published_by'  => Auth::user()?->uuid,
            'published_at'  => now(),
        ]);

        return response()->json($version, 201);
    }

    /** GET /automation/workflows/{uuid}/versions */
    public function versions(string $uuid)
    {
        $workflow = Workflow::where('uuid', $uuid)->firstOrFail();
        return response()->json($workflow->versions()->get());
    }

    /** GET /automation/workflows/{uuid}/runs — run history for this workflow */
    public function runs(string $uuid, Request $request)
    {
        $workflow = Workflow::where('uuid', $uuid)->firstOrFail();
        $runs = $workflow->runs()
            ->when($request->query('status'), fn($q, $s) => $q->where('status', $s))
            ->paginate((int) $request->query('per_page', 20));
        return response()->json($runs);
    }

    /** GET /automation/runs/{id} — a single run's detail, with action results and logs */
    public function showRun(int $id)
    {
        $run = WorkflowRun::with('version')->findOrFail($id);
        $actionResults = ActionResult::where('run_id', $run->id)->orderBy('started_at')->get();
        $logs = \App\Modules\Automation\Models\AutomationLog::where('run_id', $run->id)->orderBy('created_at')->get();

        return response()->json([
            'run'            => $run,
            'action_results' => $actionResults,
            'logs'           => $logs,
        ]);
    }
}
