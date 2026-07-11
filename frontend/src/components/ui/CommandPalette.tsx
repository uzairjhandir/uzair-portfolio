"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, User, Briefcase, FileText, Mail, Download, Code, Terminal, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalSearchQuery } from "@/lib/query/search/queries";

interface Command {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@uzair.dev");
    setIsOpen(false);
    // You could trigger a toast here
  };

  const handleDownloadResume = () => {
    const a = document.createElement("a");
    a.href = "/resume.pdf";
    a.download = "resume.pdf";
    a.click();
    setIsOpen(false);
  };

  const commands: Command[] = [
    { id: "home", name: "Home", icon: <Home size={18} />, action: () => { router.push("/"); setIsOpen(false); }, category: "Navigation" },
    { id: "about", name: "About", icon: <User size={18} />, action: () => { router.push("/#about"); setIsOpen(false); }, category: "Navigation" },
    { id: "services", name: "Services", icon: <Briefcase size={18} />, action: () => { router.push("/#services"); setIsOpen(false); }, category: "Navigation" },
    { id: "portfolio", name: "Portfolio", icon: <Code size={18} />, action: () => { router.push("/#portfolio"); setIsOpen(false); }, category: "Navigation" },
    { id: "blog", name: "Blog", icon: <FileText size={18} />, action: () => { router.push("/blog"); setIsOpen(false); }, category: "Navigation" },
    { id: "contact", name: "Contact", icon: <Mail size={18} />, action: () => { router.push("/#contact"); setIsOpen(false); }, category: "Navigation" },
    { id: "copy-email", name: "Copy Email Address", icon: <Mail size={18} />, action: handleCopyEmail, category: "Actions" },
    { id: "resume", name: "Download Resume", icon: <Download size={18} />, action: handleDownloadResume, category: "Actions" },
    { id: "source", name: "View Source Code", icon: <Terminal size={18} />, action: () => { window.open("https://github.com", "_blank"); setIsOpen(false); }, category: "Actions" },
  ];

  const { data: apiResults, isLoading } = useGlobalSearchQuery(search);

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) || cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(filteredCommands.map((c) => c.category)));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl bg-[#0A0F1A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <Search className="text-muted-foreground mr-3" size={20} />
              <input
                autoFocus
                className="flex-1 bg-transparent text-white placeholder-muted-foreground focus:outline-none text-lg"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="text-xs font-mono px-2 py-1 bg-white/5 rounded text-muted-foreground">ESC</div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {isLoading && search.length > 2 ? (
                 <div className="text-center py-8 text-muted-foreground animate-pulse">Searching...</div>
              ) : filteredCommands.length === 0 && (!apiResults || apiResults.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  No results found for &quot;{search}&quot;
                </div>
              ) : (
                <>
                  {/* API Results */}
                  {apiResults && apiResults.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2 px-2">
                        Global Search
                      </div>
                      <div className="space-y-1">
                        {apiResults.map((res) => (
                          <button
                            key={`${res.type}-${res.id}`}
                            onClick={() => { router.push(res.url); setIsOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors group"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-white">{res.title}</span>
                              <span className="text-xs text-muted-foreground">{res.type}</span>
                            </div>
                            <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Local Commands */}
                  {categories.map((category) => (
                    <div key={category}>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                        {category}
                      </div>
                      <div className="space-y-1">
                        {filteredCommands
                          .filter((cmd) => cmd.category === category)
                          .map((cmd) => (
                            <button
                              key={cmd.id}
                              onClick={cmd.action}
                              className="w-full flex items-center px-4 py-3 rounded-xl text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors group"
                            >
                              <span className="text-accent/70 group-hover:text-accent mr-3 transition-colors">
                                {cmd.icon}
                              </span>
                              <span className="font-medium">{cmd.name}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
