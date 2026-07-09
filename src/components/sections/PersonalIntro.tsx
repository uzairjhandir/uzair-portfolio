"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Download, ArrowRight, Code2, Zap, ShieldCheck, HeadphonesIcon, Server, Globe2, Coffee, Clock, Handshake, TrendingUp, Heart } from "lucide-react";
import Link from "next/link";
import { 
  siWordpress, siWoocommerce, siNextdotjs, siReact, 
  siLaravel, siPhp, siMysql, siLinux, siApache, 
  siRedis, siCloudflare, siDocker, siGit, siTypescript, siTailwindcss 
} from 'simple-icons';

const coreValues = [
  { title: "Performance", subtitle: "Lightning fast loads.", icon: <Zap size={18} className="text-cyan-400" /> },
  { title: "Security", subtitle: "Bank-grade protection.", icon: <ShieldCheck size={18} className="text-emerald-400" /> },
  { title: "Scalability", subtitle: "Built to grow.", icon: <TrendingUp size={18} className="text-blue-400" /> },
  { title: "User Experience", subtitle: "Intuitive & seamless.", icon: <Heart size={18} className="text-purple-400" /> },
];

const differentiators = [
  {
    title: "Clean Code",
    description: "Maintainable, scalable architecture.",
    icon: <Code2 size={24} />,
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-400"
  },
  {
    title: "Performance First",
    description: "Core Web Vitals optimized.",
    icon: <Zap size={24} />,
    color: "from-cyan-500/20 to-cyan-500/5",
    borderColor: "border-cyan-500/20",
    iconColor: "text-cyan-400"
  },
  {
    title: "Security Focused",
    description: "Server hardening and best practices.",
    icon: <ShieldCheck size={24} />,
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-400"
  },
  {
    title: "Long-Term Support",
    description: "Reliable maintenance and communication.",
    icon: <HeadphonesIcon size={24} />,
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-400"
  }
];

const expertiseGrid = [
  { name: "WordPress", icon: siWordpress, color: "#21759B" },
  { name: "WooCommerce", icon: siWoocommerce, color: "#96588A" },
  { name: "Next.js", icon: siNextdotjs, color: "#ffffff" },
  { name: "React", icon: siReact, color: "#61DAFB" },
  { name: "Laravel", icon: siLaravel, color: "#FF2D20" },
  { name: "PHP", icon: siPhp, color: "#777BB4" },
  { name: "MySQL", icon: siMysql, color: "#4479A1" },
  { name: "Linux", icon: siLinux, color: "#FCC624" },
  { name: "Apache", icon: siApache, color: "#D22128" },
  { name: "OpenLiteSpeed", icon: null, customIcon: <Server size={24} />, color: "#8B9556" },
  { name: "Redis", icon: siRedis, color: "#DC382D" },
  { name: "Cloudflare", icon: siCloudflare, color: "#F38020" },
  { name: "Docker", icon: siDocker, color: "#2496ED" },
  { name: "Git", icon: siGit, color: "#F05032" },
  { name: "TypeScript", icon: siTypescript, color: "#3178C6" },
  { name: "Tailwind CSS", icon: siTailwindcss, color: "#06B6D4" },
];

const industries = [
  { name: "Startups", icon: "🚀" },
  { name: "Agencies", icon: "🤝" },
  { name: "eCommerce", icon: "🛒" },
  { name: "SaaS", icon: "☁️" },
  { name: "Enterprise", icon: "🏢" },
  { name: "Hosting Providers", icon: "🌐" },
  { name: "Automotive", icon: "🏎️" },
  { name: "Healthcare", icon: "⚕️" },
  { name: "Education", icon: "📚" },
];



const funFacts = [
  { text: "Coffee-powered developer", icon: <Coffee size={16} /> },
  { text: "Available worldwide", icon: <Globe2 size={16} /> },
  { text: "Fast response time", icon: <Clock size={16} /> },
  { text: "Remote collaboration", icon: <Handshake size={16} /> },
];

export function PersonalIntro() {
  return (
    <section id="about" className="py-24 relative z-10 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Part 1: The Intro (Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4">
            <FadeIn>
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/20 to-white/5 overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.15)] transition-shadow duration-500">
                <div className="absolute inset-0 bg-[#0A0F1A]/80 backdrop-blur-xl"></div>
                <div className="relative p-8 flex flex-col items-center text-center">
                  
                  <div className="relative w-32 h-32 mb-6">
                    <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full rounded-full border border-white/20 bg-gradient-to-br from-[#111928] to-[#0A0F1A] flex items-center justify-center shadow-inner overflow-hidden group">
                      <span className="text-4xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 group-hover:scale-110 transition-transform duration-500">
                        MU
                      </span>
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0A0F1A] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>

                  <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                    Available for Freelance
                  </span>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-2xl font-bold text-white font-mono mb-1">8+</h4>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Years</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-2xl font-bold text-white font-mono mb-1">350+</h4>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Projects</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-2xl font-bold text-white font-mono mb-1">100+</h4>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Clients</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <h4 className="text-2xl font-bold text-white font-mono mb-1">20+</h4>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Countries</p>
                    </div>
                  </div>

                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Introduction & Story */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <FadeIn delay={0.1}>
              <span className="text-accent font-mono text-lg mb-4 block">Hi, I&apos;m Muhammad Uzair 👋</span>
              <h2 className="text-4xl lg:text-5xl font-heading font-extrabold text-white mb-4 leading-tight">
                Building High-Performance<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Web Experiences.</span>
              </h2>
              <p className="text-xl font-medium text-white/80 mb-6 font-mono text-sm">
                Full Stack Developer • WordPress Expert <br className="hidden sm:block" />
                Next.js • Linux Infrastructure
              </p>
              
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-10">
                <p>
                  I help businesses, startups, and agencies build high-performance websites and scalable applications.
                </p>
                <p>
                  From WordPress and WooCommerce to Next.js, Laravel, and Linux infrastructure, I focus on performance, security, maintainability, and long-term business growth.
                </p>
                <p className="p-6 rounded-2xl bg-white/5 border-l-4 border-accent shadow-[-10px_0_30px_rgba(var(--accent-rgb),0.15)] text-white/90 italic text-base relative overflow-hidden">
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_20px_rgba(var(--accent-rgb),1)]"></span>
                  &quot;My journey began with WordPress development and web hosting, where I learned the importance of performance, security, and user experience. As client requirements became more complex, I expanded into WooCommerce, Laravel, React, and Next.js while continuing to specialize in Linux server administration and cloud infrastructure. Today, I build complete digital solutions—from frontend interfaces to production-ready deployments.&quot;
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/#contact" className="hover-trigger relative px-8 py-4 rounded-xl bg-accent text-white font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.8)] overflow-hidden group">
                  <span className="relative z-10">Hire Me</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                </Link>
                <Link href="/resume.pdf" target="_blank" className="hover-trigger px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-bold tracking-wide hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-2 backdrop-blur-md">
                  <Download size={18} /> Download Resume
                </Link>
                <Link href="/#portfolio" className="hover-trigger px-8 py-4 text-white/70 font-bold hover:text-white transition-colors flex items-center gap-2">
                  View Portfolio <ArrowRight size={18} />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Part 2: What Makes Me Different? & Core Values */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-8">
            <FadeIn>
              <h3 className="text-2xl font-heading font-bold text-white mb-8">What Makes Me Different?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {differentiators.map((diff, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl border ${diff.borderColor} bg-gradient-to-br ${diff.color} backdrop-blur-sm group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-12 h-12 rounded-xl bg-[#0A0F1A] border border-white/10 flex items-center justify-center ${diff.iconColor} mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 relative z-10 shadow-lg`}>
                      {diff.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2 relative z-10">{diff.title}</h4>
                    <p className="text-muted-foreground relative z-10">{diff.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-4">
            <FadeIn delay={0.2}>
              <h3 className="text-2xl font-heading font-bold text-white mb-8">Core Values</h3>
              <div className="flex flex-col gap-4">
                {coreValues.map((val, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center group hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 rounded-lg bg-white/5">{val.icon}</div>
                      <span className="text-white font-bold font-heading">{val.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground ml-11">{val.subtitle}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Part 3: Expertise Grid & Industries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-8">
            <FadeIn>
              <h3 className="text-2xl font-heading font-bold text-white mb-8">Core Expertise</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {expertiseGrid.map((tech, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)] transition-all duration-300 group cursor-default"
                  >
                    <div 
                      className="w-10 h-10 transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-1 flex justify-center items-center drop-shadow-none group-hover:drop-shadow-[0_0_15px_currentColor]" 
                      style={{ color: tech.color }}
                    >
                      {tech.icon ? (
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-full h-full drop-shadow-md"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>{tech.name}</title>
                          <path d={tech.icon.path} />
                        </svg>
                      ) : (
                        tech.customIcon
                      )}
                    </div>
                    <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors text-center">{tech.name}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-4">
            <FadeIn delay={0.2} className="h-full">
              <div className="h-full p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10">
                <h3 className="text-2xl font-heading font-bold text-white mb-8">Industries & Clients</h3>
                <ul className="space-y-4">
                  {industries.map((ind, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-white/90">
                      <span className="text-xl flex-shrink-0" aria-hidden="true">{ind.icon}</span>
                      <span className="font-medium">{ind.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Part 4: Fun Facts Strip */}
        <FadeIn>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 p-6 rounded-full bg-white/5 border border-white/10 max-w-fit mx-auto">
            {funFacts.map((fact, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <span className="text-accent">{fact.icon}</span>
                <span>{fact.text}</span>
                {idx < funFacts.length - 1 && <span className="hidden md:inline-block ml-4 md:ml-8 text-white/20">|</span>}
              </div>
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
