import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <span className="text-8xl md:text-9xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
        404
      </span>
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">Page not found</h1>
      <p className="text-muted-foreground max-w-md mb-10">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-bold hover:bg-accent hover:text-white transition-colors">
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
        <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors">
          <Search size={18} />
          <span>Search the site</span>
        </Link>
      </div>
    </div>
  );
}
