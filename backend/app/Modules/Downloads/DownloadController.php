<?php

namespace App\Modules\Downloads;

use App\Http\Controllers\Api\V1\AbstractContentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadController extends AbstractContentController
{
    protected string $modelClass    = Download::class;
    protected string $resourceClass = DownloadResource::class;

    public function __construct(
        \App\Services\ContentPublishingService $publishingService,
        \App\Services\ContentRevisionService $revisionService,
        private DownloadRepository $downloadRepository,
    ) {
        parent::__construct($publishingService, $revisionService);
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

        // Stream using MediaService / Storage abstraction
        return Storage::disk($media->disk)->download($media->path, $media->original_filename);
    }
}
