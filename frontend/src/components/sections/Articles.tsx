"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";
import { usePublicBlogListQuery } from "@/lib/query/blog/queries";
import { BlogPost } from "@/lib/query/blog/types";

export function Articles() {
  const { data: response, isLoading, isError } = usePublicBlogListQuery({ per_page: 3, sort_by: 'publish_at', sort_dir: 'desc' });
  const articles = response?.data || [];

  return (
    <section id="articles" className="py-24 relative bg-transparent border-t border-white/5 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <FadeIn>
              <div className="text-accent font-mono text-sm font-bold tracking-widest mb-3 uppercase flex items-center gap-2">
                <span className="w-8 h-px bg-accent"></span>
                BLOG & ARTICLES
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight">
                Latest <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Insights.</span>
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link href="/blog" className="inline-flex items-center space-x-2 text-white hover:text-accent transition-colors font-medium hover-trigger border border-white/10 px-6 py-3 rounded-full hover:bg-white/5">
              <span>View All Articles</span>
              <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-muted-foreground py-10 animate-pulse">Loading articles...</div>
          ) : isError ? (
            <div className="col-span-full text-center text-red-400 py-10">Failed to load articles.</div>
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10">No articles published yet.</div>
          ) : articles.map((article: BlogPost, index: number) => (
            <FadeIn key={article.uuid} delay={index * 0.1}>
              <TiltCard className="group p-0 h-full bg-secondary/30 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500">

                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${article.featured_image?.original_url || 'https://placehold.co/800x600'})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>

                  {article.categories.length > 0 && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      {article.categories.slice(0, 2).map(cat => (
                        <span key={cat.uuid} className="px-3 py-1 bg-background/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-8 relative">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {article.publish_at && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{new Date(article.publish_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    )}
                    {article.reading_time ? (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{article.reading_time} min read</span>
                      </div>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">
                    <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0">
                      {article.title}
                    </Link>
                  </h3>

                  {article.excerpt && (
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="inline-flex items-center space-x-2 text-white font-medium group-hover:text-accent transition-colors">
                    <span>Read Article</span>
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
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
