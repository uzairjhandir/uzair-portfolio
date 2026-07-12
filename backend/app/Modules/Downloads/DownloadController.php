<?php

namespace App\Modules\Downloads;

use App\Http\Controllers\Api\V1\AbstractContentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Downloads controller.
 * Inherits all 16 standard actions from AbstractContentController, with
 * index/show/store/update overridden to eager-load media/previewMedia/seo/
 * terms and to sync SEO + taxonomy (categories), neither of which the base
 * controller's generic $fillable-only create/update can reach. Mirrors
 * BlogController/PortfolioController/CaseStudyController.
 *
 * media_id/preview_media_id are dedicated FK columns (like Blog's
 * featured_image_id) — Download does NOT rely on the shared
 * HasContentMedia trait's featuredImage()/gallery(), so it is unaffected
 * by that trait's eager-loading fix either way.
 */
class DownloadController extends AbstractContentController
{
    protected string $modelClass    = Download::class;
    protected string $resourceClass = DownloadResource::class;

    private const EAGER = ['media', 'previewMedia', 'author', 'seo', 'terms'];

    public function __construct(
        \App\Services\ContentPublishingService $publishingService,
        \App\Services\ContentRevisionService $revisionService,
        private DownloadRepository $downloadRepository,
    ) {
        parent::__construct($publishingService, $revisionService);
    }

    public function index(Request $request)
    {
        $query = Download::with(self::EAGER);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $sortBy = in_array($request->query('sort_by'), ['title', 'created_at', 'updated_at', 'download_count'])
            ? $request->query('sort_by')
            : 'created_at';
        $sortDir = $request->query('sort_dir') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        $items = $query->paginate((int) $request->query('per_page', 15));
        return DownloadResource::collection($items);
    }

    public function show(string $uuid)
    {
        $item = Download::with(self::EAGER)->where('uuid', $uuid)->firstOrFail();
        return new DownloadResource($item);
    }

    public function store(Request $request)
    {
        $data = $this->resolveMediaIds($request->except(['seo', 'categories']));
        $item = Download::create($data);
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentCreated($item));
        return new DownloadResource($item->fresh(self::EAGER));
    }

    public function update(Request $request, string $uuid)
    {
        $item = Download::where('uuid', $uuid)->firstOrFail();
        $data = $this->resolveMediaIds($request->except(['seo', 'categories']));
        $item->update($data);
        $this->syncRelations($item, $request);
        event(new \App\Events\ContentUpdated($item));
        return new DownloadResource($item->fresh(self::EAGER));
    }

    /**
     * media_id/preview_media_id are raw integer FK columns, but the frontend's
     * MediaPickerField only ever knows a media item's UUID (matches the
     * pattern already established for Blog's featured_image_id and Case
     * Study's portfolio_uuid).
     */
    private function resolveMediaIds(array $data): array
    {
        foreach (['media_id', 'preview_media_id'] as $field) {
            if (!empty($data[$field]) && !is_numeric($data[$field])) {
                $data[$field] = \App\Models\Media::where('uuid', $data[$field])->value('id');
            }
        }
        return $data;
    }

    private function syncRelations(Download $item, Request $request): void
    {
        if ($request->has('seo') && is_array($request->input('seo'))) {
            $item->syncSeo($request->input('seo'));
        }
        if ($request->has('categories')) {
            $item->syncTerms('category', $request->input('categories', []));
        }
    }

    /** GET /downloads/featured */
    public function featured()
    {
        return DownloadResource::collection($this->downloadRepository->featured());
    }

    /** GET /downloads/popular */
    public function popular()
    {
        return DownloadResource::collection($this->downloadRepository->popular());
    }

    /**
     * POST /downloads/{uuid}/serve
     * Generates a short-lived signed token stored in `download_tokens`.
     */
    public function serve(Request $request, string $uuid)
    {
        $download = Download::where('uuid', $uuid)->where('status', 'published')->firstOrFail();

        if (!$this->authorize('download', $download)) {
            $download->logEvent('denied', $request->user()?->id, null, ['reason' => 'unauthorized']);
            abort(403, 'You do not have access to this download.');
        }

        if ($download->requires_email) {
            $request->validate(['email' => 'required|email']);
        }

        if ($download->requires_accept_terms) {
            $request->validate(['terms_accepted' => 'required|accepted']);
        }

        // Token generation handles "requested" event logging
        $token = $download->generateDownloadToken(
            $request->user()?->id,
            $request->email,
            $request->ip()
        );

        return response()->json([
            'download_url' => url("/api/v1/dl/{$token->uuid}"),
            'expires_in'   => 900,
        ]);
    }

    /**
     * GET /dl/{uuid}
     * Resolves token, records download, streams media.
     * Public — no auth needed (token is the credential).
     */
    public function resolveToken(Request $request, string $uuid)
    {
        $token = DownloadToken::where('uuid', $uuid)->firstOrFail();

        if ($token->isExpired()) {
            $token->download->logEvent('expired', $token->user_id, $token->id);
            abort(410, 'Download link has expired.');
        }

        if ($token->used_at) {
            abort(410, 'This download link has already been used.');
        }

        $token->update(['used_at' => now()]);

        $download = $token->download;

        // This handles "completed" event logging and ContentMetrics update
        $download->recordDownload($token);

        $media = $download->media;
        if (!$media) abort(404, 'Media file not found.');

        // Media has no stored `path` column — MediaService::handleUpload() persists
        // to storage/app/public/{id}/{file_name} (see MediaResource::getUrl()'s
        // matching convention), not a `path`/`original_filename` pair.
        return Storage::disk($media->disk)->download($media->id . '/' . $media->file_name, $media->file_name);
    }
}
