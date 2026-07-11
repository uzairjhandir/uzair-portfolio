"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Search, PenTool, Code2, Rocket } from "lucide-react";

const processSteps = [
  {
    title: "01. Discovery",
    icon: <Search size={32} className="text-cyan-400" />,
    description: "We start by deeply understanding your business goals, target audience, and technical requirements. This foundation ensures the final product perfectly aligns with your vision.",
    features: ["Requirement Gathering", "Competitor Analysis", "Tech Stack Selection", "Project Timeline"],
    gradient: "from-cyan-500 to-blue-500",
    shadow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    borderHover: "group-hover:border-cyan-500/50"
  },
  {
    title: "02. Design & Architecture",
    icon: <PenTool size={32} className="text-purple-400" />,
    description: "Translating concepts into high-fidelity wireframes and architecting a scalable database and server structure tailored to your expected load.",
    features: ["UI/UX Prototyping", "Database Schema", "API Design", "Infrastructure Planning"],
    gradient: "from-purple-500 to-pink-500",
    shadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]",
    borderHover: "group-hover:border-purple-500/50"
  },
  {
    title: "03. Development",
    icon: <Code2 size={32} className="text-blue-400" />,
    description: "Writing clean, efficient, and well-documented code. I build the frontend and backend in parallel, focusing on performance and security at every step.",
    features: ["Frontend Implementation", "Backend APIs", "CMS Integration", "Security Best Practices"],
    gradient: "from-blue-500 to-indigo-500",
    shadow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
    borderHover: "group-hover:border-blue-500/50"
  },
  {
    title: "04. Deployment & Handoff",
    icon: <Rocket size={32} className="text-emerald-400" />,
    description: "Rigorous testing across all devices, followed by a seamless deployment to production. You receive full documentation and training on your new system.",
    features: ["QA Testing", "Performance Optimization", "CI/CD Deployment", "Client Training"],
    gradient: "from-emerald-500 to-teal-500",
    shadow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    borderHover: "group-hover:border-emerald-500/50"
  }
];

export function Process() {
  return (
    <section className="py-32 relative bg-background border-t border-white/5 overflow-hidden">
      {/* Subtle radial light behind heading */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">How I Work</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"></div>
            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
              A transparent, structured process designed to deliver exceptional results without the surprises.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-6xl mx-auto relative">
          
          {/* Desktop Connector Lines */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
            {/* Horizontal Line 1 to 2 */}
            <div className="absolute top-[20%] left-[25%] right-[25%] h-px bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-purple-500/20"></div>
            {/* Horizontal Line 3 to 4 */}
            <div className="absolute top-[70%] left-[25%] right-[25%] h-px bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-emerald-500/20"></div>
            {/* Vertical Line 2 to 4 (Right Side) */}
            <div className="absolute top-[20%] bottom-[30%] right-[25%] w-px bg-gradient-to-b from-purple-500/20 to-emerald-500/20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 relative z-10">
            {processSteps.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.1}>
                <div className={`relative p-8 md:p-10 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 transition-all duration-500 group h-full hover:-translate-y-2 ${step.shadow} ${step.borderHover}`}>
                  
                  {/* Colored Top Border */}
                  <div className={`absolute top-0 left-8 right-8 h-1 rounded-b-lg bg-gradient-to-r ${step.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  {/* Big background number */}
                  <div className="absolute right-6 top-6 text-8xl font-heading font-black text-white/[0.02] group-hover:text-white/[0.05] group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 pointer-events-none select-none">
                    0{index + 1}
                  </div>

                  {/* Icon Container */}
                  <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    {step.icon}
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-white mb-4">{step.title.split('. ')[1]}</h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-8 relative z-10">
                    {step.description}
                  </p>

                  <ul className="space-y-3 relative z-10">
                    {step.features.map(feature => (
                      <li key={feature} className="flex items-center text-sm text-gray-300">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.gradient} mr-3`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
