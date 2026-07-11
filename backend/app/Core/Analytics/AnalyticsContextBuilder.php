<?php

namespace App\Core\Analytics;

use Illuminate\Http\Request;

/**
 * Analytics Context Builder
 * 
 * Extracts request metadata (IP, UA, UTMs) and user state to build the context.
 */
class AnalyticsContextBuilder
{
    public function build(?Request $request = null): AnalyticsContext
    {
        $request = $request ?? request();

        if (!$request) {
            return new AnalyticsContext();
        }

        $userId    = $request->user()?->uuid ?? null;
        $sessionId = $request->session()->getId();
        $ipAddress = $request->ip(); // Note: Often anonymized by the driver
        $userAgent = $request->userAgent();
        $locale    = app()->getLocale();
        $referrer  = $request->header('referer');
        $url       = $request->fullUrl();

        // Extract UTM parameters
        $utmParams = $request->only(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']);

        return new AnalyticsContext(
            userId:    $userId,
            sessionId: $sessionId,
            ipAddress: $ipAddress,
            userAgent: $userAgent,
            locale:    $locale,
            referrer:  $referrer,
            url:       $url,
            utmParams: array_filter($utmParams),
            device:    $this->parseUserAgent($userAgent)
        );
    }

    private function parseUserAgent(?string $ua): array
    {
        if (!$ua) {
            return [];
        }

        // Basic detection (In production, consider a library like jenssegers/agent)
        $browser = 'Unknown';
        if (stripos($ua, 'firefox') !== false) $browser = 'Firefox';
        elseif (stripos($ua, 'chrome') !== false) $browser = 'Chrome';
        elseif (stripos($ua, 'safari') !== false) $browser = 'Safari';

        $os = 'Unknown';
        if (stripos($ua, 'windows') !== false) $os = 'Windows';
        elseif (stripos($ua, 'mac') !== false) $os = 'macOS';
        elseif (stripos($ua, 'linux') !== false) $os = 'Linux';
        elseif (stripos($ua, 'iphone') !== false || stripos($ua, 'ipad') !== false) $os = 'iOS';
        elseif (stripos($ua, 'android') !== false) $os = 'Android';

        return [
            'browser' => $browser,
            'os'      => $os,
        ];
    }
}
