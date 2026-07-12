"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowRight, ExternalLink, Activity, Clock } from "lucide-react";
import { siGithub } from "simple-icons";
import Link from "next/link";
import { usePortfolioListQuery } from "@/lib/query/portfolio/queries";
import { PortfolioProject } from "@/lib/query/portfolio/types";

/**
 * category_id/performance/overview are not part of the real Portfolio API —
 * this card was built against placeholder data. Kept optional so the display
 * degrades gracefully instead of being redesigned here (out of Phase 5 scope).
 */
type DisplayPortfolioProject = PortfolioProject & {
  category_id?: string;
  performance?: { lighthouse?: number; loadTime?: string };
  overview?: string;
  description?: string;
};

export function Portfolio() {
  const { data: response, isLoading } = usePortfolioListQuery();
  const portfolioData = response?.data || [];
  return (
    <section id="portfolio" className="py-24 relative bg-transparent border-t border-white/5">
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <FadeIn>
              <div className="text-accent font-mono text-sm font-bold tracking-widest mb-3 uppercase flex items-center gap-2">
                <span className="w-8 h-px bg-accent"></span>
                PORTFOLIO
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
                Building Products <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">That Scale.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Real-world projects focused on performance, security, and long-term maintainability.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link href="/case-studies" className="inline-flex items-center space-x-2 text-white hover:text-accent transition-colors font-medium hover-trigger border border-white/10 px-6 py-3 rounded-full hover:bg-white/5">
              <span>View All Projects</span>
              <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {isLoading ? (
            <div className="col-span-2 text-center text-muted-foreground py-10 animate-pulse">Loading portfolio...</div>
          ) : portfolioData.length === 0 ? (
            <div className="col-span-2 text-center text-muted-foreground py-10">No portfolio projects found.</div>
          ) : portfolioData.slice(0, 4).map((project: DisplayPortfolioProject, index: number) => (
            <FadeIn key={project.uuid} delay={index * 0.1}>
              <TiltCard className="portfolio-card group p-0 overflow-hidden bg-[#0A0F1A] border border-white/10 rounded-2xl flex flex-col h-full hover:border-white/20 transition-colors">
                
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.featured_image?.original_url || 'https://placehold.co/800x600'})` }}
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
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
                    {project.description || project.overview}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {(project.technologies || []).slice(0, 4).map((tech: { uuid: string; name: string }) => (
                      <span key={tech.uuid} className="px-2.5 py-1 text-xs font-medium rounded bg-white/5 border border-white/10 text-gray-300">
                        {tech.name}
                      </span>
                    ))}
                    {(project.technologies || []).length > 4 && (
                      <span className="px-2.5 py-1 text-xs font-medium rounded bg-white/5 border border-white/10 text-gray-500">
                        +{(project.technologies || []).length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
                    <Link href={`/case-studies/${project.slug}`} className="inline-flex items-center space-x-2 text-white hover:text-accent font-medium group/link before:absolute before:inset-0 before:z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-150">
                      <span>Read Case Study</span>
                      <ArrowRight size={18} className="transform group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                    
                    <div className="flex space-x-3 relative z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-200">
                      <a href="#" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white hover:scale-110">
                        <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={siGithub.path} /></svg>
                      </a>
                      <a href="#" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-accent border border-transparent transition-all text-white hover:scale-110 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
