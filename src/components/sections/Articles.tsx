"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";

const articles = [
  {
    title: "The Ultimate Guide to Next.js 14 App Router",
    excerpt: "Explore the advanced features of the Next.js App Router, including Server Components, streaming, and complex layouts.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    date: "May 15, 2026",
    readTime: "8 min read",
    tags: ["Next.js", "React"],
    link: "#"
  },
  {
    title: "Optimizing WooCommerce for 10,000+ Products",
    excerpt: "Learn how to architect a scalable WooCommerce store using Redis object caching, custom indexes, and LiteSpeed.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop",
    date: "April 02, 2026",
    readTime: "12 min read",
    tags: ["WooCommerce", "Performance"],
    link: "#"
  },
  {
    title: "Building Secure APIs with Node.js and JWT",
    excerpt: "A comprehensive walkthrough on implementing robust authentication and authorization in your Express applications.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
    date: "March 20, 2026",
    readTime: "6 min read",
    tags: ["Security", "Node.js"],
    link: "#"
  }
];

export function Articles() {
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
          {articles.map((article, index) => (
            <FadeIn key={article.title} delay={index * 0.1}>
              <TiltCard className="group p-0 h-full bg-secondary/30 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500">
                
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${article.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    {article.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-background/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 relative">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">
                    <Link href={article.link} className="after:absolute after:inset-0">
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>

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
