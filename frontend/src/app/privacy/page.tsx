import { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uzair.dev";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Muhammad Uzair's portfolio website. Learn how your data is collected, used, and protected.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
};

export default function PrivacyPolicy() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Muhammad Uzair",
    "url": `${siteUrl}/privacy`,
    "description": "Privacy Policy explaining how personal information is collected, used, and protected.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-500/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="pt-32 pb-24 min-h-screen relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              
              {/* Breadcrumb */}
              <div className="text-sm font-medium mb-12 flex items-center">
                <Link href="/" className="text-muted-foreground hover:text-white transition-colors">Home</Link>
                <span className="mx-3 text-muted-foreground/30">/</span>
                <span className="text-accent">Privacy Policy</span>
              </div>
              
              <div className="text-left mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-6">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground text-lg">Last Updated: July 2026</p>
              </div>

              {/* Glassmorphism Container */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-12 text-muted-foreground leading-relaxed">
                  
                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Introduction</h2>
                    <p>Welcome to Muhammad Uzair&apos;s portfolio website.</p>
                    <p>Your privacy is important to me. This Privacy Policy explains how I collect, use, and protect your personal information when you visit this website or contact me for professional services.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Information I Collect</h2>
                    <p>I may collect the following information:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Name</li>
                      <li>Email Address</li>
                      <li>Phone Number (if provided)</li>
                      <li>Company Name</li>
                      <li>Project Details</li>
                      <li>IP Address</li>
                      <li>Browser Information</li>
                      <li>Device Information</li>
                      <li>Analytics Data</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">How Your Information Is Used</h2>
                    <p>Your information may be used to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Respond to inquiries</li>
                      <li>Discuss project requirements</li>
                      <li>Provide quotations</li>
                      <li>Improve website performance</li>
                      <li>Monitor website usage</li>
                      <li>Enhance user experience</li>
                      <li>Protect against spam or abuse</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Analytics</h2>
                    <p>This website may use:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Google Analytics 4</li>
                      <li>Microsoft Clarity</li>
                    </ul>
                    <p>These services help understand visitor behavior and improve website performance.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Cookies</h2>
                    <p>This website may use cookies to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Remember preferences</li>
                      <li>Improve functionality</li>
                      <li>Analyze traffic</li>
                      <li>Measure performance</li>
                    </ul>
                    <p>You may disable cookies through your browser settings.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Third-Party Services</h2>
                    <p>This website may integrate with:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Google Analytics</li>
                      <li>Microsoft Clarity</li>
                      <li>Tawk.to or Crisp Live Chat</li>
                      <li>Cloudflare</li>
                      <li>GitHub</li>
                      <li>LinkedIn</li>
                      <li>Upwork</li>
                    </ul>
                    <p>These services have their own privacy policies.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Data Protection</h2>
                    <p>Reasonable technical and organizational measures are implemented to protect your information from unauthorized access or misuse.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">External Links</h2>
                    <p>This website may contain links to external websites.</p>
                    <p>I am not responsible for the privacy practices of third-party websites.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Your Rights</h2>
                    <p>You may request to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Access your personal information</li>
                      <li>Correct inaccurate information</li>
                      <li>Delete your information</li>
                      <li>Withdraw consent (where applicable)</li>
                    </ul>
                  </section>

                  <section className="space-y-4 pt-8 border-t border-white/10">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Contact</h2>
                    <p>For privacy-related questions:</p>
                    <div className="mt-4 p-6 bg-white/5 rounded-xl border border-white/5">
                      <p className="font-semibold text-white text-lg">Muhammad Uzair</p>
                      <div className="mt-4 space-y-2">
                        <p><span className="text-white/60">Email:</span> <a href="mailto:uzairjhandeer@gmail.com" className="text-accent hover:underline">uzairjhandeer@gmail.com</a></p>
                        <p><span className="text-white/60">Website:</span> <a href="https://uzair.barqhosting.com" target="_blank" rel="noreferrer" className="text-accent hover:underline">https://uzair.barqhosting.com</a></p>
                      </div>
                    </div>
                  </section>

                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
