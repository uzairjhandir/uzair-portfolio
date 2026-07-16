import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import axios from "axios";
import "./globals.css";
import { SettingCategory } from "@/lib/query/settings/types";
import { LenisProvider } from "@/providers/lenis-provider";
import { CursorProvider } from "@/providers/cursor-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { LazyCommandPalette } from "@/components/ui/LazyCommandPalette";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ChatProvider } from "@/providers/chat-provider";
import Providers from "@/providers/query-provider";
import { LiveChat } from "@/components/ui/LiveChat";
import { Toaster } from "sonner";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uzair.dev";
// Server-only context (generateMetadata always runs on the server) - talk
// to the internal backend directly, same target next.config.ts's rewrite
// proxies /api/* to, rather than a domain-specific public URL.
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000'}/api/v1`;

const DEFAULT_SITE_NAME = "Muhammad Uzair — Full Stack Web Developer & DevOps Engineer";
const DEFAULT_DESCRIPTION = "Portfolio of Muhammad Uzair: WordPress Expert, Next.js Developer, and Linux Server Administrator. Building fast, secure, and high-converting web applications.";

/**
 * Flattens the /settings/public envelope ({data: {categorySlug: {settings: [{key,value}]}}})
 * into a single key→value map. Returns {} on any failure so the caller's
 * hardcoded defaults are used — the public site must never break because
 * Settings admin data is missing or the backend is unreachable.
 */
async function getPublicSettings(): Promise<Record<string, string>> {
  try {
    const res = await axios.get(`${API_URL}/settings/public`);
    const categories = res.data?.data || {};
    const flat: Record<string, string> = {};
    for (const category of Object.values(categories) as SettingCategory[]) {
      for (const setting of category.settings || []) {
        if (setting.value !== null && setting.value !== undefined) {
          flat[setting.key] = String(setting.value);
        }
      }
    }
    return flat;
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  const siteName = settings['general.site_name'] || DEFAULT_SITE_NAME;
  const description = settings['seo.meta_description'] || DEFAULT_DESCRIPTION;
  const metaTitle = settings['seo.meta_title'] || siteName;
  const favicon = settings['general.favicon'];
  const robots = settings['seo.robots'] || 'index, follow';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: ["Next.js Developer", "React Developer", "WordPress Expert", "WooCommerce", "Web Development Agency", "Freelance Developer", "Linux Server Admin"],
    authors: [{ name: "Muhammad Uzair", url: siteUrl }],
    creator: "Muhammad Uzair",
    publisher: "Muhammad Uzair",
    alternates: {
      canonical: './',
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: {
        "msvalidate.01": process.env.BING_SITE_VERIFICATION ? [process.env.BING_SITE_VERIFICATION] : [],
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: metaTitle,
      description,
      siteName,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
      creator: "@uzair",
      images: ["/og-image.jpg"],
    },
    robots: {
      index: robots.includes('index') && !robots.includes('noindex'),
      follow: robots.includes('follow') && !robots.includes('nofollow'),
      googleBot: {
        index: robots.includes('index') && !robots.includes('noindex'),
        follow: robots.includes('follow') && !robots.includes('nofollow'),
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: favicon ? {
      icon: [{ url: favicon }],
      apple: [{ url: favicon }],
    } : {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: '32x32' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ]
    },
    manifest: '/site.webmanifest',
  };
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Muhammad Uzair",
    "jobTitle": "Senior Full Stack Developer",
    "url": siteUrl,
    "sameAs": [
      process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/uzair",
      process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/uzair",
      process.env.NEXT_PUBLIC_UPWORK_URL || "https://upwork.com/freelancers/~uzair"
    ],
    "knowsAbout": ["Web Development", "Next.js", "React", "WordPress", "PHP", "Laravel", "Linux Server Administration", "Speed Optimization"]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": siteUrl,
    "name": "Muhammad Uzair Portfolio",
    "description": "Portfolio of Muhammad Uzair: WordPress Expert, Next.js Developer, and Linux Server Admin.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Muhammad Uzair Freelance",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": process.env.NEXT_PUBLIC_EMAIL || "contact@uzair.dev",
      "contactType": "customer support"
    }
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-accent/30 selection:text-white"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-white focus:text-primary focus:font-medium"
        >
          Skip to main content
        </a>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}

        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}

        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        
        {/* Global Premium Background Layers */}
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-background">
          {/* Premium Radial Gradient (Calm & Modern) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0A192F]/40 via-background to-background"></div>
          
          {/* Moving Grid */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-repeat" style={{ backgroundSize: "40px 40px" }}></div>
          
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
          
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        </div>

        <Providers>
          <LenisProvider>
            <CursorProvider>
              <Loader />
              <LazyCommandPalette />
              <ScrollToTop />
              <Navbar />
              <main id="main-content" className="flex-grow pt-24">{children}</main>
              <Footer />
              <LiveChat />
            </CursorProvider>
          </LenisProvider>
          <ChatProvider />
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
