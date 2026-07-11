<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Repositories\PageBuilderRepository;
use App\Services\PageBuilderService;
use App\Http\Requests\Builder\SyncPageBlocksRequest;
use App\Http\Requests\Builder\UpdatePageStatusRequest;
use App\Http\Resources\PageRenderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageBuilderController extends Controller
{
    public function __construct(
        private PageBuilderRepository $repository,
        private PageBuilderService $service
    ) {}

    public function sync(SyncPageBlocksRequest $request, string $uuid)
    {
        $page = Page::where('uuid', $uuid)->firstOrFail();
        
        $this->repository->syncBlocks($page, $request->validated('blocks'));
        
        return response()->json(['message' => 'Builder draft saved successfully.']);
    }

    public function publish(UpdatePageStatusRequest $request, string $uuid)
    {
        $page = Page::where('uuid', $uuid)->firstOrFail();
        $status = $request->validated('status');
        
        if ($status === \App\Enums\PageStatusEnum::PUBLISHED->value) {
            $this->service->validateForPublish($page);
            $this->service->triggerAutoRegeneration($page);
        }

        $page->update([
            'status' => $status,
            'publish_date' => $request->validated('publish_at'),
        ]);

        return response()->json(['message' => "Page status updated to {$status}."]);
    }

    public function render(string $uuid)
    {
        $page = Page::where('uuid', $uuid)->with('pageBlocks.block.type')->firstOrFail();
        
        return new PageRenderResource($page);
    }
}
