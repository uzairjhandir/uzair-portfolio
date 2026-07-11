<?php

namespace App\Core\Feeds;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * Single universal feed endpoint. No module creates its own feed controller.
 *
 * Routes:
 *   GET /api/v1/feed/{slug}.xml   → RSS
 *   GET /api/v1/feed/{slug}.atom  → Atom
 *   GET /api/v1/feed/{slug}.json  → JSON Feed
 *   GET /api/v1/feeds             → List all registered feeds
 */
class FeedController extends Controller
{
    public function __construct(private FeedManager $manager) {}

    public function index(): \Illuminate\Http\JsonResponse
    {
        $feeds = collect($this->manager->all())->map(fn($p) => [
            'slug'        => $p->getFeedSlug(),
            'title'       => $p->getFeedTitle(),
            'description' => $p->getFeedDescription(),
            'rss'         => url("/api/v1/feed/{$p->getFeedSlug()}.xml"),
            'atom'        => url("/api/v1/feed/{$p->getFeedSlug()}.atom"),
            'json'        => url("/api/v1/feed/{$p->getFeedSlug()}.json"),
        ])->values();

        return response()->json($feeds);
    }

    public function serve(string $slug, string $format = 'rss'): \Illuminate\Http\Response
    {
        $contentType = match($format) {
            'atom' => 'application/atom+xml; charset=utf-8',
            'json' => 'application/feed+json; charset=utf-8',
            default => 'application/rss+xml; charset=utf-8',
        };

        $body = $this->manager->render($slug, $format);
        return response($body, 200)->header('Content-Type', $contentType);
    }
}
