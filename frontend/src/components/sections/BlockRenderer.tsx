"use client";

import { PageBlockRender } from "@/lib/query/pages/types";

/**
 * Renders a single Page Builder block by its BlockType slug. Only the 11
 * structural slugs seeded in block_types are handled (hero, about, services,
 * testimonials, faq, statistics, client-logos, contact-section, experience,
 * skills, technologies, process); anything else, or a block with no usable
 * content, renders nothing so the caller's static-section fallback shows
 * instead — see Phase 9.1 "missing blocks handled gracefully".
 */
export function BlockRenderer({ block }: { block: PageBlockRender }) {
  // Block content is admin-authored, per-BlockType-schema JSON with no fixed
  // shape on the frontend — cast once here rather than threading `unknown`
  // through every field access below.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = block.content as Record<string, any> | null;
  if (!content || Object.keys(content).length === 0) return null;

  const anchorId = block.anchor || undefined;

  switch (block.type) {
    case "hero":
      return (
        <section id={anchorId} className="py-24 relative">
          <div className="container mx-auto px-6 text-center">
            {content.eyebrow && (
              <div className="text-accent font-mono text-sm font-bold tracking-widest mb-3 uppercase">{content.eyebrow}</div>
            )}
            {content.title && (
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6">{content.title}</h1>
            )}
            {content.subtitle && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{content.subtitle}</p>
            )}
          </div>
        </section>
      );

    case "about":
      return (
        <section id={anchorId} className="py-24 relative">
          <div className="container mx-auto px-6">
            {content.title && <h2 className="text-4xl font-heading font-bold text-white mb-6">{content.title}</h2>}
            {content.body && <div className="prose prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: content.body }} />}
          </div>
        </section>
      );

    case "services":
      return (
        <section id={anchorId} className="py-24 relative">
          <div className="container mx-auto px-6">
            {content.title && <h2 className="text-4xl font-heading font-bold text-white mb-12 text-center">{content.title}</h2>}
            {Array.isArray(content.items) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    {item.title && <h3 className="text-xl font-heading font-bold text-white mb-3">{item.title}</h3>}
                    {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "testimonials":
      return (
        <section id={anchorId} className="py-24 relative">
          <div className="container mx-auto px-6">
            {content.title && <h2 className="text-4xl font-heading font-bold text-white mb-12 text-center">{content.title}</h2>}
            {Array.isArray(content.items) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    {item.quote && <p className="text-white italic mb-4">&ldquo;{item.quote}&rdquo;</p>}
                    {item.author && <p className="text-muted-foreground text-sm font-medium">{item.author}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "faq":
      return (
        <section id={anchorId} className="py-24 relative">
          <div className="container mx-auto px-6 max-w-3xl">
            {content.title && <h2 className="text-4xl font-heading font-bold text-white mb-12 text-center">{content.title}</h2>}
            {Array.isArray(content.items) && (
              <div className="space-y-4">
                {content.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    {item.question && <h3 className="text-white font-semibold mb-2">{item.question}</h3>}
                    {item.answer && <p className="text-muted-foreground text-sm">{item.answer}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "statistics":
      return (
        <section id={anchorId} className="py-24 relative">
          <div className="container mx-auto px-6">
            {Array.isArray(content.items) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {content.items.map((item: any, idx: number) => (
                  <div key={idx}>
                    {item.value && <div className="text-4xl font-heading font-extrabold text-white mb-2">{item.value}</div>}
                    {item.label && <div className="text-muted-foreground text-sm">{item.label}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "client-logos":
      return (
        <section id={anchorId} className="py-16 relative border-y border-white/5">
          <div className="container mx-auto px-6">
            {Array.isArray(content.logos) && (
              <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
                {content.logos.map((logo: any, idx: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={idx} src={logo.url} alt={logo.name || "Client logo"} className="h-8 object-contain" />
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "contact-section":
      return (
        <section id={anchorId} className="py-24 relative">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            {content.title && <h2 className="text-4xl font-heading font-bold text-white mb-4">{content.title}</h2>}
            {content.subtitle && <p className="text-muted-foreground mb-8">{content.subtitle}</p>}
          </div>
        </section>
      );

    case "experience":
    case "skills":
    case "technologies":
    case "process":
      return (
        <section id={anchorId} className="py-24 relative">
          <div className="container mx-auto px-6">
            {content.title && <h2 className="text-4xl font-heading font-bold text-white mb-12 text-center">{content.title}</h2>}
            {Array.isArray(content.items) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    {item.title && <h3 className="text-white font-semibold mb-2">{item.title}</h3>}
                    {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    default:
      return null;
  }
}
