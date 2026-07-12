import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/animations/FadeIn";
import { ArrowLeft, Calendar, Clock, User, Share2, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { BlogPost } from "@/lib/query/blog/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await axios.get(`${API_URL}/public/blogs/${slug}`);
    return res.data.data;
  } catch {
    return null;
  }
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await axios.get(`${API_URL}/public/blogs`, { params: { per_page: 100 } });
    return res.data.data || [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uzair.dev";

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      images: [
        {
          url: post.featured_image?.original_url || 'https://placehold.co/1200x630',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      images: [post.featured_image?.original_url || 'https://placehold.co/1200x630'],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // To get prev/next and related we fetch all (or we could rely on backend logic)
  const allPosts = await getAllPosts();
  const postIndex = allPosts.findIndex((p) => p.slug === post.slug);
  
  const prevPost = postIndex > 0 ? allPosts[postIndex - 1] : null;
  const nextPost = postIndex > -1 && postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;

  // Filter related posts (simplified)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://uzair.dev";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [
      post.featured_image?.original_url
        ? (post.featured_image.original_url.startsWith('http') ? post.featured_image.original_url : `${siteUrl}${post.featured_image.original_url}`)
        : 'https://placehold.co/1200x630'
    ],
    "datePublished": new Date(post.publish_at || post.created_at).toISOString(),
    "dateModified": new Date(post.publish_at || post.created_at).toISOString(),
    "author": [{
        "@type": "Person",
        "name": "Admin",
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
      "name": "Blog",
      "item": `${siteUrl}/blog`
    },{
      "@type": "ListItem",
      "position": 3,
      "name": post.title,
      "item": `${siteUrl}/blog/${post.slug}`
    }]
  };

  return (
    <article className="min-h-screen bg-background pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${post.featured_image?.original_url || 'https://placehold.co/1920x1080'})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A]/80 via-[#0A0F1A]/95 to-[#0A0F1A]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px] pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <FadeIn>
            <Link href="/blog" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-white transition-colors mb-10 group">
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Articles</span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-bold tracking-wider uppercase border border-accent/20">
                Article
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium border-t border-white/10 pt-8 mt-8">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <User size={14} />
                </div>
                Admin
              </span>
              <span className="flex items-center gap-2"><Calendar size={16} className="text-white/40" /> {new Date(post.publish_at || post.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-white/40" /> 5 min read</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-6 py-20 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Article Content */}
          <div className="lg:col-span-8">
            <FadeIn>
              <div 
                className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-white 
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-muted-foreground prose-li:mb-2
                prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
                prose-pre:bg-[#0A0F1A] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-medium hover:bg-white/10 transition-colors cursor-pointer">
                    <Hash size={14} className="text-accent" /> Backend
                  </span>
              </div>

              {/* Share Buttons */}
              <div className="mt-12 flex items-center gap-4">
                <span className="text-white font-bold font-heading flex items-center gap-2">
                  <Share2 size={18} className="text-accent" /> Share this article:
                </span>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-500 hover:border-transparent transition-colors font-bold font-mono">
                    X
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-700 hover:border-transparent transition-colors font-bold font-mono">
                    in
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-transparent transition-colors font-bold font-mono">
                    f
                  </button>
                </div>
              </div>

              {/* Prev / Next Navigation */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 transition-colors group flex flex-col items-start text-left">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ChevronLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" /> Previous
                    </span>
                    <span className="text-white font-heading font-bold group-hover:text-accent transition-colors line-clamp-2">{prevPost.title}</span>
                  </Link>
                ) : <div></div>}
                
                {nextPost ? (
                  <Link href={`/blog/${nextPost.slug}`} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 transition-colors group flex flex-col items-end text-right">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      Next <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-white font-heading font-bold group-hover:text-accent transition-colors line-clamp-2">{nextPost.title}</span>
                  </Link>
                ) : <div></div>}
              </div>

            </FadeIn>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <FadeIn className="sticky top-32 space-y-10">
              
              {/* Table of Contents */}
              <div className="p-8 rounded-3xl bg-secondary/30 border border-white/10 backdrop-blur-md">
                <h3 className="text-lg font-heading font-bold text-white mb-6 uppercase tracking-wider text-sm">Table of Contents</h3>
                <ul className="space-y-4">
                    <li>
                      <a href={`#`} className="text-muted-foreground hover:text-accent transition-colors block text-sm">
                        Introduction
                      </a>
                    </li>
                </ul>
              </div>

              {/* Newsletter CTA */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 backdrop-blur-md">
                <h3 className="text-xl font-heading font-bold text-white mb-4">Never miss an update</h3>
                <p className="text-muted-foreground mb-6 text-sm">Get notified when I publish new articles about web performance and development architecture.</p>
                <form className="space-y-3">
                  <input type="email" placeholder="Your email address" className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" />
                  <button type="button" className="w-full py-3 rounded-xl bg-white text-primary font-bold hover:bg-accent hover:text-white transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>

            </FadeIn>
          </div>

        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto px-6 py-20 border-t border-white/5 relative z-10">
          <FadeIn>
            <h2 className="text-3xl font-heading font-bold text-white mb-12">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${relatedPost.featured_image?.original_url || 'https://placehold.co/600x400'})` }}></div>
                  </div>
                  <div className="p-6">
                    <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2 block">Article</span>
                    <h3 className="text-lg font-heading font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
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
