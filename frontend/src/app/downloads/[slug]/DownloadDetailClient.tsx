"use client";

import { useState } from "react";
import { usePublicDownloadDetailQuery } from "@/lib/query/downloads/queries";
import { useServeDownloadMutation } from "@/lib/query/downloads/mutations";
import { FadeIn } from "@/components/animations/FadeIn";
import Link from "next/link";
import { ArrowLeft, Download as DownloadIcon, Loader2 } from "lucide-react";

export function DownloadDetailClient({ slug }: { slug: string }) {
  const { data: item, isLoading, isError } = usePublicDownloadDetailQuery(slug);
  const serveMutation = useServeDownloadMutation();
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">Loading...</div>;
  }

  if (isError || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-xl text-white font-heading font-bold">Download not found</p>
        <Link href="/downloads" className="text-accent hover:text-white transition-colors">Back to Downloads</Link>
      </div>
    );
  }

  const canSubmit = (!item.requires_email || email.length > 3) && (!item.requires_accept_terms || termsAccepted);

  const handleGetDownload = async () => {
    setError(null);
    try {
      const result = await serveMutation.mutateAsync({
        uuid: item.uuid,
        email: item.requires_email ? email : undefined,
        termsAccepted: item.requires_accept_terms ? termsAccepted : undefined,
      });
      window.location.href = result.download_url;
    } catch {
      setError("Unable to generate download link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-6 relative z-10 max-w-3xl">
          <FadeIn>
            <Link href="/downloads" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-white transition-colors mb-10 group">
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Downloads</span>
            </Link>

            {item.categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {item.categories.map((c) => (
                  <span key={c.uuid} className="px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-bold tracking-wider uppercase border border-accent/20">
                    {c.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 leading-tight">
              {item.title}
            </h1>

            {item.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-10">{item.excerpt}</p>
            )}

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
              {item.latest_version && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span className="text-white font-medium">{item.latest_version}</span>
                </div>
              )}
              {item.license_type && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">License</span>
                  <span className="text-white font-medium">{item.license_type}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Downloads</span>
                <span className="text-white font-medium">{item.download_count}</span>
              </div>

              {item.requires_email && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              )}

              {item.requires_accept_terms && (
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1"
                  />
                  <span>I accept the license terms for this download.</span>
                </label>
              )}

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={handleGetDownload}
                disabled={!canSubmit || serveMutation.isPending}
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white text-primary font-bold hover:bg-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {serveMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <DownloadIcon size={18} />
                )}
                <span>{serveMutation.isPending ? "Preparing..." : "Get Download"}</span>
              </button>
            </div>

            {item.content && (
              <div
                className="prose prose-invert prose-lg max-w-none mt-12 prose-headings:font-heading prose-p:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
