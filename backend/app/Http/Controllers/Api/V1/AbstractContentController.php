<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ContentPublishingService;
use App\Services\ContentRevisionService;
use App\Repositories\ContentRepository;
use App\Enums\ContentStatusEnum;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;

/**
 * Base controller for all content modules (Blog, Portfolio, Case Study, Pages).
 * Provides standard CRUD + lifecycle actions. Extend and override only what is unique.
 *
 * Usage:
 *   class BlogController extends AbstractContentController
 *   {
 *       protected string $modelClass = Blog::class;
 *       protected string $resourceClass = BlogResource::class;
 *   }
 */
abstract class AbstractContentController extends Controller
{
    protected string $modelClass;
    protected string $resourceClass;

    public function __construct(
        protected ContentPublishingService $publishingService,
        protected ContentRevisionService $revisionService,
    ) {}

    public function index(Request $request)
    {
        $items = $this->modelClass::latest()->paginate(15);
        return $this->resourceClass::collection($items);
    }

    public function show(string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        return new $this->resourceClass($item);
    }

    public function store(Request $request)
    {
        // Extend in child controller for specific validation. Falls back to the
        // model's own $fillable as the mass-assignment boundary when no child
        // controller provides a FormRequest.
        $item = $this->modelClass::create($request->all());
        event(new \App\Events\ContentCreated($item));
        return new $this->resourceClass($item);
    }

    public function update(Request $request, string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $item->update($request->all());
        event(new \App\Events\ContentUpdated($item));
        return new $this->resourceClass($item);
    }

    public function destroy(string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        event(new \App\Events\ContentDeleted($item));
        $item->delete();
        return response()->noContent();
    }

    public function publish(string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $this->publishingService->transition($item, ContentStatusEnum::PUBLISHED);
        return response()->json(['message' => 'Content published.']);
    }

    public function unpublish(string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $this->publishingService->transition($item, ContentStatusEnum::ARCHIVED);
        event(new \App\Events\ContentUnpublished($item));
        return response()->json(['message' => 'Content unpublished.']);
    }

    public function duplicate(Request $request, string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $mode = $request->input('mode', 'as_draft'); // as_draft | as_template | with_media | without_media

        // Lifecycle hook
        if (method_exists($item, 'beforeDuplicate')) {
            $item->beforeDuplicate();
        }

        $clone = (new ContentRepository($this->modelClass))->duplicateWithOptions($item, $mode);
        return new $this->resourceClass($clone);
    }

    public function restore(Request $request, string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $this->revisionService->restore($item, $request->input('version'));
        event(new \App\Events\ContentRestored($item));
        return response()->json(['message' => 'Content restored.']);
    }

    public function preview(string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $token = $item->generatePreviewToken();
        return response()->json(['preview_url' => url("/preview/{$token}")]);
    }

    public function export(string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        return response()->json($item->toArray());
    }

    public function import(Request $request)
    {
        $data = $request->validate(['payload' => 'required|array']);
        unset($data['payload']['id'], $data['payload']['uuid']);
        $item = $this->modelClass::create($data['payload']);
        return new $this->resourceClass($item);
    }

    /**
     * List all revisions for a content item.
     * GET /{resource}/{uuid}/revisions
     */
    public function revisions(string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        return response()->json($this->revisionService->listVersions($item));
    }

    /**
     * Show a single revision snapshot.
     * GET /{resource}/{uuid}/revisions/{version}
     */
    public function showRevision(string $uuid, string $version)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $revision = $item->revisions()->where('version', $version)->firstOrFail();
        return response()->json($revision);
    }

    /**
     * Diff two revisions — returns Added/Removed/Modified map.
     * GET /{resource}/{uuid}/revisions/diff?version_a=v1&version_b=v3
     * React Admin renders a GitHub-style +/- viewer from this.
     */
    public function diffRevisions(Request $request, string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $diff = $this->revisionService->compare(
            $item,
            $request->input('version_a'),
            $request->input('version_b')
        );
        return response()->json($diff);
    }

    /**
     * Heartbeat — editor pings every 20–30s to keep the lock alive.
     * POST /{resource}/{uuid}/heartbeat
     */
    public function heartbeat(Request $request, string $uuid)
    {
        $item = $this->modelClass::where('uuid', $uuid)->firstOrFail();
        $item->heartbeat($request->input('lock_token'));
        return response()->json(['message' => 'Heartbeat acknowledged.']);
    }
}
