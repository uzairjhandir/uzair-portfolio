"use client";

import { usePortfolioListQuery } from "@/lib/query/portfolio/queries";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";
import { ArrowRight, Activity, Clock } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { PortfolioProject } from "@/lib/query/portfolio/types";

export function CaseStudiesClient() {
  const { data: response, isLoading } = usePortfolioListQuery();
  const caseStudiesData = response?.data || [];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 leading-tight">
              Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Studies.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Real-world examples of how I help businesses scale through performance optimization, modern architecture, and robust engineering.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {isLoading ? (
            <div className="col-span-2 text-center text-muted-foreground py-10 animate-pulse">Loading case studies...</div>
          ) : caseStudiesData.length === 0 ? (
            <div className="col-span-2 text-center text-muted-foreground py-10">No case studies found.</div>
          ) : caseStudiesData.map((project: any, index: number) => (
            <FadeIn key={project.slug} delay={index * 0.1}>
              <TiltCard className="portfolio-card group p-0 overflow-hidden bg-[#0A0F1A] border border-white/10 rounded-2xl flex flex-col h-full hover:border-white/20 transition-colors">
                
                {/* Image Section */}
                <div className="relative h-72 w-full overflow-hidden shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.featured_image || 'https://placehold.co/800x600'})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow relative -mt-8 bg-gradient-to-t from-[#0A0F1A] via-[#0A0F1A] to-transparent">
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-accent font-mono text-xs font-bold tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                      {project.category_id || 'Project'}
                    </span>
                    <div className="flex gap-2 relative z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100">
                      {project.performance?.lighthouse && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-white shadow-lg">
                          <Activity size={14} className="text-accent" />
                          <span className="hidden lg:inline">Lighthouse:</span>
                          <span>{project.performance.lighthouse}</span>
                        </div>
                      )}
                      {project.performance?.loadTime && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-medium text-white shadow-lg">
                          <Clock size={14} className="text-accent" />
                          <span className="hidden lg:inline">Load:</span>
                          <span>{project.performance.loadTime}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {project.description || project.overview}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(project.technologies || []).slice(0, 5).map((tech: string) => (
                      <span key={tech} className="px-2.5 py-1 text-xs font-medium rounded bg-white/5 border border-white/10 text-gray-300">
                        {tech}
                      </span>
                    ))}
                    {(project.technologies || []).length > 5 && (
                      <span className="px-2.5 py-1 text-xs font-medium rounded bg-white/5 border border-white/10 text-gray-500">
                        +{(project.technologies || []).length - 5}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                    <Link href={`/case-studies/${project.slug}`} className="inline-flex items-center space-x-2 text-white hover:text-accent font-medium group/link before:absolute before:inset-0 before:z-10 w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-150">
                      <span>Read Case Study</span>
                      <ArrowRight size={18} className="transform group-hover/link:translate-x-2 transition-transform" />
                    </Link>
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
