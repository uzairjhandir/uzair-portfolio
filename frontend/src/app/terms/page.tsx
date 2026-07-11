import { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uzair.dev";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for Muhammad Uzair's professional web development and consulting services.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
};

export default function TermsAndConditions() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms & Conditions - Muhammad Uzair",
    "url": `${siteUrl}/terms`,
    "description": "Terms and Conditions governing the use of this website and professional services.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-purple-500/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

      <div className="pt-32 pb-24 min-h-screen relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              
              {/* Breadcrumb */}
              <div className="text-sm font-medium mb-12 flex items-center">
                <Link href="/" className="text-muted-foreground hover:text-white transition-colors">Home</Link>
                <span className="mx-3 text-muted-foreground/30">/</span>
                <span className="text-accent">Terms & Conditions</span>
              </div>
              
              <div className="text-left mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mb-6">
                  Terms & Conditions
                </h1>
                <p className="text-muted-foreground text-lg">Last Updated: July 2026</p>
              </div>

              {/* Glassmorphism Container */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-12 text-muted-foreground leading-relaxed">
                  
                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Introduction</h2>
                    <p>These Terms & Conditions govern your use of this website and any professional services offered by Muhammad Uzair.</p>
                    <p>By using this website, you agree to these terms.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Services</h2>
                    <p>Services may include:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>WordPress Development</li>
                      <li>WooCommerce Development</li>
                      <li>Next.js Development</li>
                      <li>React Development</li>
                      <li>Laravel Development</li>
                      <li>Server Administration</li>
                      <li>Linux Administration</li>
                      <li>Performance Optimization</li>
                      <li>Website Security</li>
                      <li>Website Maintenance</li>
                      <li>Consulting</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Quotations</h2>
                    <p>All quotations are based on project scope.</p>
                    <p>Additional work outside the agreed scope may require a revised quotation.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Payments</h2>
                    <p>Payment schedules are agreed before project commencement.</p>
                    <p>Late payments may delay project delivery.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Intellectual Property</h2>
                    <p>Unless otherwise agreed:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Client owns the final delivered work after full payment.</li>
                      <li>Reusable libraries, utilities, frameworks, and internal tools remain the intellectual property of Muhammad Uzair.</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Client Responsibilities</h2>
                    <p>Clients agree to provide:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Required content</li>
                      <li>Images</li>
                      <li>Branding assets</li>
                      <li>Hosting access</li>
                      <li>Timely feedback</li>
                    </ul>
                    <p>Project timelines may be affected by delays in client communication.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Limitation of Liability</h2>
                    <p>Reasonable care is taken during development.</p>
                    <p>However, no guarantee is made against:</p>
                    <ul className="list-disc pl-6 space-y-2 text-white/80">
                      <li>Third-party outages</li>
                      <li>Hosting failures</li>
                      <li>Plugin conflicts</li>
                      <li>Browser-specific issues</li>
                      <li>Security incidents beyond reasonable control</li>
                    </ul>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Warranty</h2>
                    <p>Bug fixes related to delivered functionality may be provided for an agreed warranty period (if included in the proposal).</p>
                    <p>Feature requests are treated as new development work.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Confidentiality</h2>
                    <p>Client information is treated as confidential unless permission is granted to showcase the project in the portfolio.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Portfolio Rights</h2>
                    <p>Unless restricted by NDA, completed projects may be displayed within this portfolio for demonstration purposes.</p>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Changes</h2>
                    <p>These Terms may be updated periodically.</p>
                    <p>Continued use of the website indicates acceptance of the latest version.</p>
                  </section>

                  <section className="space-y-4 pt-8 border-t border-white/10">
                    <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white">Contact</h2>
                    <p>For questions regarding these Terms:</p>
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
