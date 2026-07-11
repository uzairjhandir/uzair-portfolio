"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { TiltCard } from "@/components/ui/TiltCard";
import { Code2, Server, ShoppingCart, Rocket, ShieldCheck, Database, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "WordPress Development",
    icon: <Code2 size={32} className="text-white" />,
    color: "from-blue-500 to-cyan-500",
    description: "Custom themes, Elementor, WPBakery, and complete maintenance solutions tailored to your brand.",
    features: ["Custom Themes", "Elementor", "WPBakery", "Maintenance"],
  },
  {
    title: "WooCommerce",
    icon: <ShoppingCart size={32} className="text-white" />,
    color: "from-purple-500 to-pink-500",
    description: "High-converting online stores with custom payment gateways and advanced shipping rules.",
    features: ["Payment Gateway", "Subscriptions", "Shipping", "Performance"],
  },
  {
    title: "Next.js Development",
    icon: <Rocket size={32} className="text-white" />,
    color: "from-zinc-400 to-zinc-100",
    description: "Blazing fast modern web apps, landing pages, and SEO-optimized static sites.",
    features: ["Modern Websites", "Landing Pages", "React Apps", "SEO"],
  },
  {
    title: "Server Management",
    icon: <Server size={32} className="text-white" />,
    color: "from-green-500 to-emerald-400",
    description: "Robust hosting architectures built on WHM, cPanel, Apache, and LiteSpeed.",
    features: ["WHM / cPanel", "Apache", "LiteSpeed", "Nginx", "Cloud"],
  },
  {
    title: "Speed Optimization",
    icon: <Database size={32} className="text-white" />,
    color: "from-yellow-500 to-orange-500",
    description: "Achieve 100/100 Core Web Vitals with advanced caching and CDN integration.",
    features: ["Core Web Vitals", "Caching", "CDN", "Image Optimization"],
  },
  {
    title: "Security & Monitoring",
    icon: <ShieldCheck size={32} className="text-white" />,
    color: "from-red-500 to-rose-400",
    description: "Enterprise-grade protection with active firewalls, malware removal, and SSL.",
    features: ["Firewall", "Malware Removal", "SSL", "24/7 Monitoring"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 relative bg-transparent overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <FadeIn>
            <div className="text-accent font-mono text-sm font-bold tracking-widest mb-3 uppercase flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-accent"></span>
              CORE EXPERTISE
              <span className="w-8 h-px bg-accent"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight">
              Comprehensive <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Digital Solutions.</span>
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <FadeIn key={service.title} delay={0.1}>
              <TiltCard className="h-full relative group">
                {/* Border Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${service.color} rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm`}></div>
                
                <div className="relative h-full flex flex-col bg-background/90 backdrop-blur-xl border border-white/10 group-hover:border-transparent p-8 rounded-xl transition-colors duration-500 overflow-hidden">
                  
                  {/* Subtle Background Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-full blur-[40px] -mr-10 -mt-10 transition-opacity duration-500`}></div>

                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-[1px] shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110`}>
                      <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20`}></div>
                        <div className="relative z-10">{service.icon}</div>
                      </div>
                    </div>
                    
                    <Link href="#contact" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-300 hover-trigger">
                      <ArrowUpRight size={18} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                  
                  <h3 className="text-2xl font-heading font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-3 mt-auto">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color} mr-3 shadow-[0_0_5px_rgba(255,255,255,0.3)]`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
