"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const linkedinPath = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";
const xPath = "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";
const githubPath = "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background relative text-foreground pt-20 pb-10 overflow-hidden border-t border-white/5">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-2/3 h-48 bg-accent/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10 mb-16">
        
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-block hover-trigger mb-6" aria-label="Home">
            <Logo variant="full" className="h-10" />
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
            Building Fast, Secure & High-Converting Websites. Full Stack Developer specializing in Next.js, WordPress, and Linux Server Administration.
          </p>
          
          <div className="flex space-x-3 mb-8">
            {[
              { path: githubPath, href: "https://github.com/uzair" },
              { path: linkedinPath, href: "https://linkedin.com/in/uzair" },
              { path: xPath, href: "https://twitter.com/uzair" }
            ].map((social, i) => (
              <a 
                key={i}
                href={social.href} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 hover-trigger"
              >
                <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          <div className="space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-white font-medium">Available for Freelance</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-xs">⚡</span> Usually replies within 2 hours
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-heading font-semibold text-white mb-6">Explore</h3>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {["About", "Services", "Portfolio", "Process", "Contact"].map((item) => (
              <li key={item}>
                <Link href={`/#${item.toLowerCase()}`} className="group flex items-center hover:text-accent transition-colors hover-trigger w-fit">
                  <span>{item}</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="font-heading font-semibold text-white mb-6">Tech Stack</h3>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {["Next.js / React", "WordPress / Woo", "Laravel / PHP", "Linux / DevOps", "Tailwind CSS"].map((item) => (
              <li key={item}>
                <span className="hover:text-white transition-colors cursor-default">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-heading font-semibold text-white mb-6">Newsletter</h3>
          <p className="text-xs text-muted-foreground mb-4">Subscribe for tips on web performance and scaling.</p>
          <form className="relative group" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 rounded-md text-white hover:bg-accent transition-colors hover-trigger">
              <ArrowUpRight size={16} />
            </button>
          </form>
        </div>

      </div>

      <div className="container mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Muhammad Uzair. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
