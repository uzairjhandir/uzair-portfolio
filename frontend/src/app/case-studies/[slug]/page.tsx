import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { ArrowLeft, CheckCircle2, ArrowRight, Quote, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { CaseStudy } from "@/lib/query/case-studies/types";

// Server-only context - talk to the internal backend directly.
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000'}/api/v1`;

async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const res = await axios.get(`${API_URL}/public/case-studies/${slug}`);
    return res.data.data;
  } catch {
    return null;
  }
}

async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    const res = await axios.get(`${API_URL}/public/case-studies`, { params: { per_page: 100 } });
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const studies = await getAllCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const study = await getCaseStudy(resolvedParams.slug);

  if (!study) return {};

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uzair.dev";
  const description = study.seo?.description || study.excerpt || '';
  const image = study.featured_image?.original_url || 'https://placehold.co/1200x630';

  return {
    title: study.seo?.title || `${study.title} | Case Study`,
    description,
    alternates: {
      canonical: study.seo?.canonical_url || `${siteUrl}/case-studies/${study.slug}`,
    },
    openGraph: {
      title: study.seo?.title || study.title,
      description,
      type: "article",
      url: `${siteUrl}/case-studies/${study.slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: study.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: study.seo?.title || study.title,
      description,
      images: [image],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const study = await getCaseStudy(resolvedParams.slug);

  if (!study) {
    notFound();
  }

  const allStudies = await getAllCaseStudies();
  const relatedStudies = allStudies.filter((s) => s.slug !== study.slug).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uzair.dev";
  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": study.title,
    "description": study.excerpt || '',
    "image": [study.featured_image?.original_url || 'https://placehold.co/1200x630'],
    "author": [{ "@type": "Person", "name": "Muhammad Uzair", "url": siteUrl }],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Case Studies", "item": `${siteUrl}/case-studies` },
      { "@type": "ListItem", "position": 3, "name": study.title, "item": `${siteUrl}/case-studies/${study.slug}` },
    ],
  };

  return (
    <article className="min-h-screen bg-background pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${study.featured_image?.original_url || 'https://placehold.co/1920x1080'})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A]/80 via-[#0A0F1A]/95 to-[#0A0F1A]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[200px] pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn>
            <Link href="/case-studies" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-white transition-colors mb-10 group">
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Case Studies</span>
            </Link>

            {study.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {study.categories.map((c) => (
                  <span key={c.uuid} className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase border border-accent/20">
                    {c.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-12 leading-tight max-w-5xl">
              {study.title}
            </h1>

            {(study.portfolio || study.technologies.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8 border-y border-white/10 mt-12 bg-white/5 rounded-2xl px-8 backdrop-blur-sm">
                {study.portfolio && (
                  <div>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Related Project</p>
                    <p className="text-white font-semibold text-lg">{study.portfolio.title}</p>
                  </div>
                )}
                {study.duration_weeks && (
                  <div>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Duration</p>
                    <p className="text-white font-semibold text-lg">{study.duration_weeks} weeks</p>
                  </div>
                )}
                {study.technologies.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Technologies</p>
                    <p className="text-white font-semibold text-lg">
                      {study.technologies.slice(0, 2).map((t) => t.name).join(", ")}
                      {study.technologies.length > 2 && <span className="text-accent text-sm ml-2">+{study.technologies.length - 2}</span>}
                    </p>
                  </div>
                )}
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-24">
            {study.excerpt && (
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">1</span>
                  Overview
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{study.excerpt}</p>
              </FadeIn>
            )}

            {(study.challenge || study.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FadeIn delay={0.1} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">The Challenge</h3>
                  <p className="text-muted-foreground leading-relaxed">{study.challenge || 'N/A'}</p>
                </FadeIn>
                <FadeIn delay={0.2} className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-accent/20">
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">The Solution</h3>
                  <p className="text-muted-foreground leading-relaxed">{study.solution || 'N/A'}</p>
                </FadeIn>
              </div>
            )}

            {study.implementation && (
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">2</span>
                  Implementation
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">{study.implementation}</p>
                {study.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {study.technologies.map((tech) => (
                      <span key={tech.uuid} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium hover:bg-white/10 transition-colors">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                )}
              </FadeIn>
            )}

            {study.outcome_metrics && study.outcome_metrics.length > 0 && (
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">3</span>
                  Outcome Metrics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {study.outcome_metrics.map((m, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-[#0A0F1A]/80 border border-white/10 flex flex-col items-center justify-center text-center shadow-xl hover:border-accent/40 hover:-translate-y-1 transition-all">
                      <span className="text-3xl font-bold font-mono text-white mb-2">{m.value}</span>
                      <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">{m.label}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            {study.gallery.length > 0 && (
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">4</span>
                  Project Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {study.gallery.map((img, idx) => (
                    <div key={img.uuid} className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl group relative ${idx === 0 ? 'md:col-span-2' : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.original_url}
                        alt={`${study.title} screenshot ${idx + 1}`}
                        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <FadeIn className="sticky top-32 space-y-8">
              {study.results && (
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <h3 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3">
                    <CheckCircle2 className="text-accent" />
                    Results
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{study.results}</p>
                </div>
              )}

              {study.customer_quote && (
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
                  <Quote className="absolute top-4 right-4 text-white/5" size={80} />
                  <blockquote className="text-lg text-white/90 leading-relaxed italic relative z-10">
                    &quot;{study.customer_quote}&quot;
                  </blockquote>
                </div>
              )}

              <div className="p-8 rounded-3xl bg-primary border border-primary/50 backdrop-blur-md shadow-2xl shadow-primary/20">
                <h3 className="text-2xl font-heading font-bold text-white mb-4">Start a Project</h3>
                <p className="text-white/80 mb-8 leading-relaxed">Let&apos;s build an exceptional digital experience together.</p>
                <Link href="/#contact" className="flex items-center justify-center w-full py-4 rounded-xl bg-white text-primary font-bold hover:bg-accent hover:text-white transition-colors shadow-lg">
                  <span>Get in Touch</span>
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {relatedStudies.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-white/5 relative z-10">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Related Case Studies</h2>
              <Link href="/case-studies" className="text-accent hover:text-white transition-colors font-medium flex items-center gap-2">
                View All <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedStudies.map((related) => (
                <Link key={related.slug} href={`/case-studies/${related.slug}`} className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/50 transition-colors">
                  <div className="relative h-64 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${related.featured_image?.original_url || 'https://placehold.co/800x600'})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-heading font-bold text-white group-hover:text-accent transition-colors">{related.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </section>
      )}
    </article>
  );
}
