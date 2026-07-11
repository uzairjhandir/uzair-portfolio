"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
import { TiltCard } from "@/components/ui/TiltCard";

const timeline = [
  {
    year: "2018",
    title: "Started Freelancing",
    description: "Began journey as a freelance web developer, focusing on HTML, CSS, and basic WordPress sites.",
  },
  {
    year: "2019",
    title: "WordPress Expert",
    description: "Mastered WordPress theme and plugin development, delivering custom solutions to clients worldwide.",
  },
  {
    year: "2020",
    title: "WooCommerce Specialization",
    description: "Expanded expertise into eCommerce, building high-conversion WooCommerce stores.",
  },
  {
    year: "2021",
    title: "Hosting Management",
    description: "Started managing VPS and Dedicated servers for clients using WHM and cPanel.",
  },
  {
    year: "2022",
    title: "Server Optimization",
    description: "Deep dive into LiteSpeed, Apache, Nginx, and Redis for ultimate speed optimization.",
  },
  {
    year: "2023",
    title: "React & Next.js",
    description: "Transitioned to modern JavaScript frameworks for enterprise-grade applications.",
  },
  {
    year: "2024",
    title: "Cloud Infrastructure",
    description: "Mastered Docker, Cloudflare, and CI/CD pipelines for robust deployments.",
  },
  {
    year: "2025",
    title: "AI Integrations",
    description: "Incorporating AI-driven solutions and automation into web applications.",
  },
  {
    year: "2026",
    title: "Senior Full Stack Developer",
    description: "Leading complex, full-stack projects combining Next.js with advanced server architecture.",
  },
];

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="about" className="py-32 relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        <div className="text-center mb-20">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">My Journey</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"></div>
          </FadeIn>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Base Vertical Line */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full"></div>
          
          {/* Animated Fill Line */}
          <motion.div 
            className="absolute left-[39px] md:left-1/2 top-0 w-1 bg-gradient-to-b from-primary via-accent to-primary md:-translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.8)] origin-top"
            style={{ height: lineHeight }}
          ></motion.div>

          <div className="space-y-16 md:space-y-24">
            {timeline.map((item, index) => (
              <FadeIn key={item.year} delay={0.1} direction={index % 2 === 0 ? "right" : "left"}>
                <div className={`flex flex-col md:flex-row items-center justify-between w-full group ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  
                  <div className="hidden md:block w-5/12"></div>
                  
                  {/* Timeline Dot */}
                  <div className="z-20 flex items-center justify-center w-12 h-12 rounded-full bg-background border-4 border-white/10 group-hover:border-accent transition-colors duration-500 shadow-lg absolute left-4 md:left-1/2 -translate-x-1/2">
                    <div className="w-4 h-4 rounded-full bg-white/20 group-hover:bg-accent group-hover:shadow-[0_0_15px_rgba(var(--accent-rgb),1)] transition-all duration-500 scale-50 group-hover:scale-100"></div>
                  </div>

                  {/* Card Content */}
                  <TiltCard className="w-[calc(100%-5rem)] ml-20 md:ml-0 md:w-5/12 relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur-xl"></div>
                    
                    <div className="relative bg-background border border-white/10 group-hover:border-transparent p-8 rounded-xl h-full transition-colors duration-500">
                      <span className="text-white font-bold font-mono text-xl mb-6 inline-block px-6 py-2 bg-white/5 backdrop-blur-md border border-white/20 rounded-full shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] relative overflow-hidden group/badge">
                        <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 group-hover/badge:opacity-40 transition-opacity duration-300"></span>
                        <span className="relative z-10">{item.year}</span>
                      </span>
                      <h3 className="text-2xl font-heading font-semibold text-white mb-3">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </TiltCard>
                  
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
