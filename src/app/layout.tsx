import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/providers/lenis-provider";
import { CursorProvider } from "@/providers/cursor-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ChatProvider } from "@/providers/chat-provider";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uzair.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Uzair — Full Stack Web Developer & DevOps Engineer",
    template: "%s | Muhammad Uzair"
  },
  description: "Portfolio of Muhammad Uzair: WordPress Expert, Next.js Developer, and Linux Server Administrator. Building fast, secure, and high-converting web applications.",
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
    title: "Muhammad Uzair — Premium Web Experiences",
    description: "I engineer premium digital experiences that look stunning and perform flawlessly. From high-conversion frontends to robust production infrastructure.",
    siteName: "Muhammad Uzair Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Muhammad Uzair Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Uzair — Full Stack Developer",
    description: "Building fast, secure, and high-converting web applications.",
    creator: "@uzair",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
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

        <LenisProvider>
          <CursorProvider>
            <Loader />
            <CommandPalette />
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow pt-24">{children}</main>
            <Footer />
          </CursorProvider>
        </LenisProvider>
        <ChatProvider />
      </body>
    </html>
  );
}
