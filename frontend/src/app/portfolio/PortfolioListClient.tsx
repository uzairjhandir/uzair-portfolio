"use client";

import { usePublicPortfolioListQuery } from "@/lib/query/portfolio/queries";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { PortfolioProject } from "@/lib/query/portfolio/types";

export function PortfolioListClient() {
  const { data: response, isLoading, isError } = usePublicPortfolioListQuery();
  const portfolioData = response?.data || [];

  return (
    <div className="min-h-screen bg-background pb-32">
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 leading-tight">
              Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Projects.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A collection of products and platforms built for performance, security, and long-term maintainability.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {isLoading ? (
            <div className="col-span-2 text-center text-muted-foreground py-10 animate-pulse">Loading portfolio...</div>
          ) : isError ? (
            <div className="col-span-2 text-center text-red-400 py-10">Failed to load portfolio. Please try again later.</div>
          ) : portfolioData.length === 0 ? (
            <div className="col-span-2 text-center text-muted-foreground py-10">No portfolio projects published yet.</div>
          ) : portfolioData.map((project: PortfolioProject, index: number) => (
            <FadeIn key={project.uuid} delay={index * 0.1}>
              <TiltCard className="portfolio-card group p-0 overflow-hidden bg-[#0A0F1A] border border-white/10 rounded-2xl flex flex-col h-full hover:border-white/20 transition-colors">
                <div className="relative h-64 w-full overflow-hidden shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.featured_image?.original_url || 'https://placehold.co/800x600'})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                </div>
                <div className="p-8 flex flex-col flex-grow relative -mt-8 bg-gradient-to-t from-[#0A0F1A] via-[#0A0F1A] to-transparent">
                  {project.client_name && (
                    <span className="text-accent font-mono text-xs font-bold tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20 self-start mb-4">
                      {project.client_name}
                    </span>
                  )}
                  <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-accent transition-colors">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-2">{project.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                    <Link href={`/portfolio/${project.slug}`} className="inline-flex items-center space-x-2 text-white hover:text-accent font-medium group/link before:absolute before:inset-0 before:z-10 w-full">
                      <span>View Project</span>
                      <ArrowRight size={18} className="transform group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                    {project.project_url && (
                      <ExternalLink size={16} className="text-muted-foreground shrink-0 relative z-20" />
                    )}
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
