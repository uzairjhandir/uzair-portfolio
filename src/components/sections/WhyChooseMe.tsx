"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Zap, Shield, Search, Smartphone, Code, Clock, Headset, TrendingUp } from "lucide-react";

import { TiltCard } from "@/components/ui/TiltCard";
import { useEffect, useRef } from "react";

const reasons = [
  {
    icon: <Zap size={24} />,
    title: "Lightning Fast",
    description: "I build websites optimized for speed, achieving 95+ Lighthouse scores to reduce bounce rates.",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: <Shield size={24} />,
    title: "Bank-Grade Security",
    description: "Implementing strict security protocols, firewalls, and regular audits to keep your data safe.",
    color: "from-emerald-400 to-green-600"
  },
  {
    icon: <Search size={24} />,
    title: "SEO Optimized",
    description: "Semantic HTML, schema markup, and optimal URL structures built-in from day one.",
    color: "from-blue-400 to-indigo-500"
  },
  {
    icon: <Smartphone size={24} />,
    title: "Responsive Design",
    description: "Pixel-perfect layouts that look and function beautifully across all devices and screen sizes.",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: <Code size={24} />,
    title: "Clean Architecture",
    description: "Maintainable, well-documented code following modern best practices and design patterns.",
    color: "from-cyan-400 to-blue-500"
  },
  {
    icon: <Clock size={24} />,
    title: "On-Time Delivery",
    description: "Strict adherence to project timelines with transparent communication at every milestone.",
    color: "from-rose-400 to-red-500"
  },
  {
    icon: <Headset size={24} />,
    title: "Dedicated Support",
    description: "Ongoing maintenance and support to ensure your application runs smoothly long-term.",
    color: "from-teal-400 to-emerald-500"
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Conversion Focused",
    description: "UX/UI design decisions driven by data and psychology to maximize your conversion rates.",
    color: "from-violet-400 to-purple-600"
  }
];

export function WhyChooseMe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll('.glow-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="py-24 relative bg-transparent border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        <div className="text-center mb-16">
          <FadeIn>
            <div className="text-accent font-mono text-sm font-bold tracking-widest mb-3 uppercase flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-accent"></span>
              WHY WORK WITH ME
              <span className="w-8 h-px bg-accent"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
              Why Choose <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">My Services.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Delivering premium engineering with a relentless focus on performance, security, and scalability.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <FadeIn key={reason.title} delay={index * 0.1}>
              <TiltCard className="glow-card group relative p-8 h-full bg-[#0A0F1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-default transition-all duration-300 hover:border-white/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Mouse Follow Spotlight */}
                <div 
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  style={{
                    background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`,
                  }}
                />
                
                {/* Hover Spotlight effect */}
                <div aria-hidden="true" className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-20 rounded-full blur-[40px] -mr-10 -mt-10 transition-opacity duration-500 pointer-events-none z-0`}></div>
                
                <div className="relative z-20 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${reason.color} p-[1px] mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-20`}></div>
                      <div className="relative z-10 text-white transform transition-transform duration-300 group-hover:scale-110">{reason.icon}</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white mb-3 transition-colors duration-300 group-hover:text-white">
                    {reason.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-white transition-colors duration-300">
                    {reason.description}
                  </p>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
