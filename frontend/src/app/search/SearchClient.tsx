"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { useGlobalSearchQuery } from "@/lib/query/search/queries";

export function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(initialQuery);

  const { data: response, isLoading, isError } = useGlobalSearchQuery(initialQuery);
  const results = response?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(inputValue)}`);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <section className="relative pt-40 pb-16 border-b border-white/5">
        <div className="container mx-auto px-6 max-w-3xl">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-8">Search</h1>
            <form onSubmit={handleSubmit} className="relative">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search blog, portfolio, case studies, downloads..."
                aria-label="Search the site"
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent text-lg"
              />
            </form>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 max-w-3xl">
        {!initialQuery ? (
          <p className="text-muted-foreground text-center py-10">Enter a search term above to get started.</p>
        ) : isLoading ? (
          <p className="text-muted-foreground text-center py-10 animate-pulse">Searching...</p>
        ) : isError ? (
          <p className="text-red-400 text-center py-10">Something went wrong. Please try again.</p>
        ) : results.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">No results found for &quot;{initialQuery}&quot;.</p>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6">
              {response?.total ?? results.length} result{(response?.total ?? results.length) !== 1 ? "s" : ""} for &quot;{initialQuery}&quot;
            </p>
            <div className="space-y-3">
              {results.map((res) => (
                <Link
                  key={res.uuid}
                  href={res.url}
                  className="flex items-center justify-between px-6 py-5 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/50 transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-mono uppercase tracking-wider text-accent mb-1">{res.type}</span>
                    <span className="text-lg font-semibold text-white group-hover:text-accent transition-colors">{res.title}</span>
                    {res.summary && <span className="text-sm text-muted-foreground mt-1 line-clamp-2">{res.summary}</span>}
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground shrink-0 ml-4 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
