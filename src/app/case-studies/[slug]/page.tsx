/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudiesData } from "@/lib/data/case-studies";
import { FadeIn } from "@/components/animations/FadeIn";
import { ArrowLeft, CheckCircle2, ArrowRight, Quote, Zap, Activity, Clock, Award, ShieldCheck, ArrowUpRight, TrendingUp, Search } from "lucide-react";
import Link from "next/link";


export async function generateStaticParams() {
  return caseStudiesData.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const study = caseStudiesData.find((s) => s.slug === resolvedParams.slug);
  
  if (!study) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uzair.dev";

  return {
    title: `${study.title} | Case Study`,
    description: study.overview.substring(0, 160),
    alternates: {
      canonical: `${siteUrl}/case-studies/${study.slug}`,
    },
    openGraph: {
      title: `${study.title} | Case Study`,
      description: study.overview.substring(0, 160),
      type: "article",
      url: `${siteUrl}/case-studies/${study.slug}`,
      images: [
        {
          url: study.heroImage,
          width: 1200,
          height: 630,
          alt: study.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.title} | Case Study`,
      description: study.overview.substring(0, 160),
      images: [study.heroImage],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const caseStudy = caseStudiesData.find((c) => c.slug === resolvedParams.slug);

  if (!caseStudy) {
    notFound();
  }

  // Helper to find related projects
  const relatedProjects = caseStudiesData.filter(c => caseStudy.relatedProjects.includes(c.slug));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uzair.dev";
  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": caseStudy.title,
    "description": caseStudy.overview,
    "image": [
      caseStudy.heroImage.startsWith('http') ? caseStudy.heroImage : `${siteUrl}${caseStudy.heroImage}`
    ],
    "author": [{
        "@type": "Person",
        "name": "Muhammad Uzair",
        "url": siteUrl
      }]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Portfolio",
      "item": `${siteUrl}/#portfolio`
    },{
      "@type": "ListItem",
      "position": 3,
      "name": caseStudy.title,
      "item": `${siteUrl}/case-studies/${caseStudy.slug}`
    }]
  };

  return (
    <article className="min-h-screen bg-background pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${caseStudy.heroImage})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A]/80 via-[#0A0F1A]/95 to-[#0A0F1A]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[200px] pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn>
            <Link href="/#portfolio" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-white transition-colors mb-10 group">
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Portfolio</span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase border border-accent/20">
                {caseStudy.category}
              </span>
              <span className="text-muted-foreground text-sm font-medium tracking-wide uppercase border-l border-white/10 pl-4">
                {caseStudy.industry}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-12 leading-tight max-w-5xl">
              {caseStudy.title}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/10 mt-12 bg-white/5 rounded-2xl px-8 backdrop-blur-sm">
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Client</p>
                <p className="text-white font-semibold text-lg">{caseStudy.client}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Timeline</p>
                <p className="text-white font-semibold text-lg">{caseStudy.duration}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Team</p>
                <p className="text-white font-semibold text-lg">{caseStudy.teamSize}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  <p className="text-white font-semibold text-lg">
                    {caseStudy.technologies.slice(0, 2).join(", ")}
                    {caseStudy.technologies.length > 2 && <span className="text-accent text-sm ml-2">+{caseStudy.technologies.length - 2}</span>}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 space-y-24">
            
            {/* Project Overview */}
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">1</span>
                Project Overview
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {caseStudy.overview}
              </p>
            </FadeIn>

            {/* Challenge & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FadeIn delay={0.1} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-heading font-bold text-white mb-4">The Challenge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {caseStudy.challenge}
                </p>
              </FadeIn>
              <FadeIn delay={0.2} className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-accent/20">
                <h3 className="text-2xl font-heading font-bold text-white mb-4">The Solution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {caseStudy.solution}
                </p>
              </FadeIn>
            </div>

            {/* Architecture & Tech Stack */}
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">2</span>
                Architecture & Tech Stack
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {caseStudy.architecture}
              </p>
              <div className="flex flex-wrap gap-3">
                {caseStudy.technologies.map(tech => (
                  <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-medium hover:bg-white/10 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Key Features */}
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">3</span>
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseStudy.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-white/10">
                    <CheckCircle2 className="text-accent mt-0.5 flex-shrink-0" size={20} />
                    <span className="text-white font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Development Timeline */}
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">4</span>
                Development Timeline
              </h2>
              <div className="space-y-8 border-l-2 border-white/10 ml-5 pl-8 relative">
                {caseStudy.developmentProcess.map((process, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-accent ring-4 ring-[#0A0F1A]"></span>
                    <h4 className="text-xl font-heading font-bold text-white mb-2">{process.step}</h4>
                    <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Performance Metrics */}
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">5</span>
                Performance Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Lighthouse", value: caseStudy.performance.lighthouse, icon: <Activity size={24} /> },
                  { label: "SEO", value: caseStudy.performance.seo, icon: <Search size={24} /> },
                  { label: "Accessibility", value: caseStudy.performance.accessibility, icon: <Award size={24} /> },
                  { label: "Best Practices", value: caseStudy.performance.bestPractices, icon: <ShieldCheck size={24} /> },
                  { label: "Load Time", value: caseStudy.performance.loadTime, icon: <Clock size={24} /> },
                  { label: "TTFB", value: caseStudy.performance.ttfb, icon: <Zap size={24} /> },
                ].map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#0A0F1A]/80 border border-white/10 flex flex-col items-center justify-center text-center shadow-xl hover:border-accent/40 hover:-translate-y-1 transition-all group">
                    <div className="text-accent mb-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">{stat.icon}</div>
                    <span className="text-4xl font-bold font-mono text-white mb-2">{stat.value}</span>
                    <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Image Gallery */}
            {caseStudy.gallery.length > 0 && (
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">6</span>
                  Project Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseStudy.gallery.map((img, idx) => (
                    <div key={idx} className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl group relative ${idx === 0 ? 'md:col-span-2' : ''}`}>
                      <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                      <img 
                        src={img} 
                        alt={`${caseStudy.title} screenshot ${idx + 1}`} 
                        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}

            {/* Before / After */}
            {caseStudy.beforeAfter && (
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">7</span>
                  Before & After
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-red-500/30 opacity-70">
                      <img src={caseStudy.beforeAfter.beforeImg} alt="Before" className="w-full h-auto grayscale-[50%]" />
                    </div>
                    <p className="text-center text-red-400 font-medium tracking-widest uppercase text-sm">Before</p>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                      <img src={caseStudy.beforeAfter.afterImg} alt="After" className="w-full h-auto" />
                    </div>
                    <p className="text-center text-green-400 font-medium tracking-widest uppercase text-sm">After</p>
                  </div>
                </div>
              </FadeIn>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <FadeIn className="sticky top-32 space-y-8">
              
              {/* Results */}
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="text-accent" />
                  Final Results
                </h3>
                <div className="space-y-4">
                  {caseStudy.results.map((result, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <ArrowRight size={18} className="text-accent mt-1 flex-shrink-0" />
                      <p className="text-muted-foreground leading-relaxed">{result}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
                <Quote className="absolute top-4 right-4 text-white/5" size={80} />
                <h3 className="text-xl font-heading font-bold text-white mb-6 relative z-10">Client Feedback</h3>
                <blockquote className="text-lg text-white/90 leading-relaxed italic mb-8 relative z-10">
                  &quot;{caseStudy.testimonial.quote}&quot;
                </blockquote>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent font-bold text-xl">
                    {caseStudy.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold">{caseStudy.testimonial.author}</p>
                    <p className="text-muted-foreground text-sm">{caseStudy.testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="p-8 rounded-3xl bg-primary border border-primary/50 backdrop-blur-md shadow-2xl shadow-primary/20">
                <h3 className="text-2xl font-heading font-bold text-white mb-4">Start a Project</h3>
                <p className="text-white/80 mb-8 leading-relaxed">Let&apos;s build an exceptional digital experience together. Fast, secure, and built to scale.</p>
                <Link href="/#contact" className="flex items-center justify-center w-full py-4 rounded-xl bg-white text-primary font-bold hover:bg-accent hover:text-white transition-colors shadow-lg">
                  <span>Get in Touch</span>
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>

            </FadeIn>
          </div>

        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-white/5 relative z-10">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
                Related Projects
              </h2>
              <Link href="/#portfolio" className="text-accent hover:text-white transition-colors font-medium flex items-center gap-2">
                View All <ArrowUpRight size={18} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map(project => (
                <Link key={project.slug} href={`/case-studies/${project.slug}`} className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/50 transition-colors">
                  <div className="relative h-64 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${project.heroImage})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-accent text-xs font-bold tracking-widest uppercase mb-2 block">{project.category}</span>
                      <h3 className="text-2xl font-heading font-bold text-white group-hover:text-accent transition-colors">{project.title}</h3>
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
