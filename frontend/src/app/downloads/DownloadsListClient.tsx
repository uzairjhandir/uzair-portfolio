"use client";

import { usePublicDownloadListQuery } from "@/lib/query/downloads/queries";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";
import { ArrowRight, Download as DownloadIcon } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { DownloadItem } from "@/lib/query/downloads/types";

export function DownloadsListClient() {
  const { data: response, isLoading, isError } = usePublicDownloadListQuery();
  const downloadsData = response?.data || [];

  return (
    <div className="min-h-screen bg-background pb-32">
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 leading-tight">
              Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Downloads.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Templates, tools, and resources to help you build better software.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-muted-foreground py-10 animate-pulse">Loading downloads...</div>
          ) : isError ? (
            <div className="col-span-full text-center text-red-400 py-10">Failed to load downloads. Please try again later.</div>
          ) : downloadsData.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10">No downloads published yet.</div>
          ) : downloadsData.map((item: DownloadItem, index: number) => (
            <FadeIn key={item.uuid} delay={index * 0.1}>
              <TiltCard className="group p-0 overflow-hidden bg-[#0A0F1A] border border-white/10 rounded-2xl flex flex-col h-full hover:border-white/20 transition-colors">
                <div className="relative h-40 w-full overflow-hidden shrink-0 bg-white/5">
                  {item.preview_image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${item.preview_image.original_url})` }}
                    ></div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <DownloadIcon size={40} className="text-white/20" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  {item.categories.length > 0 && (
                    <span className="text-accent font-mono text-xs font-bold tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20 self-start mb-4">
                      {item.categories[0].name}
                    </span>
                  )}
                  <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                  {item.excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-2">{item.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto text-sm text-muted-foreground">
                    <Link href={`/downloads/${item.slug}`} className="inline-flex items-center space-x-2 text-white hover:text-accent font-medium before:absolute before:inset-0 before:z-10 w-full">
                      <span>Get Download</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                    {item.download_count > 0 && (
                      <span className="relative z-20 shrink-0">{item.download_count} downloads</span>
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
