import type { NextConfig } from "next";

// No next.config file existed at all before this — Next.js was running on
// 100% defaults: no image remote-patterns (why so much code fell back to
// raw <img> instead of next/image), and no security headers.
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const apiHost = (() => {
  try {
    return new URL(apiUrl).hostname;
  } catch {
    return "localhost";
  }
})();

const securityHeaders = [
  // Conservative CSP: allows same-origin plus the specific third parties
  // already wired into the app (Tawk.to/Crisp live chat, GA/Clarity/Meta
  // Pixel analytics, Google Fonts). 'unsafe-inline'/'unsafe-eval' on
  // script-src are required by Next.js dev/HMR and several of these
  // third-party embed scripts; tightening further needs per-script
  // nonces, which is a larger change than this stabilization pass.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://embed.tawk.to https://client.crisp.chat https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https://client.crisp.chat https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS is only meaningful over real HTTPS in production — harmless to
  // send in dev, but the actual enforcement only matters once Phase 11
  // deployment terminates TLS in front of this app.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: apiHost === "localhost" ? "http" : "https",
        hostname: apiHost,
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
