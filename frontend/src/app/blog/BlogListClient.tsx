"use client";

import { usePublicBlogListQuery } from "@/lib/query/blog/queries";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { BlogPost } from "@/lib/query/blog/types";

export function BlogListClient() {
  const { data: response, isLoading, isError, refetch } = usePublicBlogListQuery();
  const blogData = response?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-32 pt-40 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-white/10 rounded"></div>
          <div className="h-4 w-48 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background pb-32 pt-40 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">Failed to load articles. Please try again.</p>
        <button onClick={() => refetch()} className="text-sm text-white underline underline-offset-4 hover:text-accent transition-colors">
          Retry
        </button>
      </div>
    );
  }

  if (!blogData.length) {
    return (
      <div className="min-h-screen bg-background pb-32 pt-40 flex items-center justify-center">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  const featuredPost = blogData[0];
  const regularPosts = blogData.slice(1);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 leading-tight">
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Insights.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Deep dives into high-performance web architecture, server optimization, and modern frontend development.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 relative z-10">
        
        {/* Featured Post */}
        <FadeIn>
          <div className="mb-20">
            <h2 className="text-sm font-bold tracking-widest uppercase text-accent mb-8 flex items-center gap-4">
              <span className="w-12 h-px bg-accent"></span>
              Featured Article
            </h2>
            
            <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#0A0F1A]/80 border border-white/10 rounded-3xl overflow-hidden hover:border-accent/40 transition-all duration-500 shadow-2xl">
              <div className="relative h-80 lg:h-full overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${featuredPost.featured_image?.original_url || 'https://placehold.co/800x600'})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] lg:bg-gradient-to-r lg:from-transparent to-transparent opacity-80"></div>
              </div>
              <div className="p-10 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">Article</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(featuredPost.publish_at || featuredPost.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 group-hover:text-accent transition-colors leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-2 text-white font-semibold group-hover:text-accent transition-colors">
                  Read Article <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </FadeIn>

        {/* Recent Posts Grid */}
        {regularPosts.length > 0 && (
          <FadeIn>
            <h2 className="text-sm font-bold tracking-widest uppercase text-accent mb-8 flex items-center gap-4">
              <span className="w-12 h-px bg-accent"></span>
              Recent Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post: BlogPost) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${post.featured_image?.original_url || 'https://placehold.co/600x400'})` }}></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-[#0A0F1A]/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                        Article
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.publish_at || post.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-white text-sm font-semibold group-hover:text-accent transition-colors mt-auto pt-4 border-t border-white/10">
                      Read Article <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        )}

      </section>
    </div>
  );
}
