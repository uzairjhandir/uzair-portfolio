import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { ArrowLeft, ArrowRight, ExternalLink, ArrowUpRight } from "lucide-react";
import { siGithub } from "simple-icons";
import Link from "next/link";
import axios from "axios";
import { PortfolioProject } from "@/lib/query/portfolio/types";

// Server-only context - talk to the internal backend directly.
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000'}/api/v1`;

async function getProject(slug: string): Promise<PortfolioProject | null> {
  try {
    const res = await axios.get(`${API_URL}/public/portfolios/${slug}`);
    return res.data.data;
  } catch {
    return null;
  }
}

async function getAllProjects(): Promise<PortfolioProject[]> {
  try {
    const res = await axios.get(`${API_URL}/public/portfolios`, { params: { per_page: 100 } });
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);

  if (!project) return {};

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uzair.dev";
  const description = project.seo?.description || project.excerpt || '';
  const image = project.featured_image?.original_url || 'https://placehold.co/1200x630';

  return {
    title: project.seo?.title || project.title,
    description,
    alternates: { canonical: project.seo?.canonical_url || `${siteUrl}/portfolio/${project.slug}` },
    openGraph: {
      title: project.seo?.title || project.title,
      description,
      type: "article",
      url: `${siteUrl}/portfolio/${project.slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo?.title || project.title,
      description,
      images: [image],
    },
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getAllProjects();
  const relatedProjects = allProjects.filter((p) => p.slug !== project.slug).slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://uzair.dev";
  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.excerpt || '',
    "image": [project.featured_image?.original_url || 'https://placehold.co/1200x630'],
    "author": [{ "@type": "Person", "name": "Muhammad Uzair", "url": siteUrl }],
  };

  return (
    <article className="min-h-screen bg-background pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }} />

      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${project.featured_image?.original_url || 'https://placehold.co/1920x1080'})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A]/80 via-[#0A0F1A]/95 to-[#0A0F1A]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn>
            <Link href="/portfolio" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-white transition-colors mb-10 group">
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Portfolio</span>
            </Link>

            {project.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {project.categories.map((c) => (
                  <span key={c.uuid} className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase border border-accent/20">
                    {c.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-8 leading-tight max-w-5xl">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              {project.project_url && (
                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-bold hover:bg-accent hover:text-white transition-colors">
                  <ExternalLink size={18} /> Visit Live Site
                </a>
              )}
              {project.repository_url && (
                <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors">
                  <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={siGithub.path} /></svg>
                  View Source
                </a>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {project.excerpt && (
              <FadeIn>
                <h2 className="text-3xl font-heading font-bold text-white mb-6">Overview</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{project.excerpt}</p>
              </FadeIn>
            )}

            {project.content && (
              <FadeIn>
                <div
                  className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-p:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              </FadeIn>
            )}

            {project.gallery.length > 0 && (
              <FadeIn>
                <h2 className="text-3xl font-heading font-bold text-white mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.gallery.map((img, idx) => (
                    <div key={img.uuid} className={`relative aspect-video rounded-2xl overflow-hidden border border-white/10 ${idx === 0 ? 'md:col-span-2' : ''}`}>
                      <Image
                        src={img.original_url}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}
          </div>

          <div className="lg:col-span-4">
            <FadeIn className="sticky top-32 space-y-6">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
                {project.client_name && (
                  <div>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Client</p>
                    <p className="text-white font-semibold">{project.client_name}</p>
                  </div>
                )}
                {project.completion_date && (
                  <div>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-medium">Completed</p>
                    <p className="text-white font-semibold">{new Date(project.completion_date).toLocaleDateString()}</p>
                  </div>
                )}
                {project.technologies.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-3 font-medium">Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((t) => (
                        <span key={t.uuid} className="px-3 py-1 text-xs font-medium rounded bg-white/5 border border-white/10 text-gray-300">{t.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 rounded-3xl bg-primary border border-primary/50 shadow-2xl shadow-primary/20">
                <h3 className="text-xl font-heading font-bold text-white mb-4">Have a similar project?</h3>
                <Link href="/#contact" className="flex items-center justify-center w-full py-3 rounded-xl bg-white text-primary font-bold hover:bg-accent hover:text-white transition-colors">
                  <span>Get in Touch</span>
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-white/5 relative z-10">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-heading font-bold text-white">More Projects</h2>
              <Link href="/portfolio" className="text-accent hover:text-white transition-colors font-medium flex items-center gap-2">
                View All <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((p) => (
                <Link key={p.slug} href={`/portfolio/${p.slug}`} className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/50 transition-colors">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${p.featured_image?.original_url || 'https://placehold.co/600x400'})` }}></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-accent transition-colors">{p.title}</h3>
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
