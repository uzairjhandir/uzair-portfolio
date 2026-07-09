"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ExternalLink, Award } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

const certifications = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024",
    link: "#",
    color: "from-orange-400 to-yellow-500"
  },
  {
    title: "cPanel & WHM System Administrator",
    issuer: "cPanel University",
    date: "2023",
    link: "#",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "LiteSpeed Server Expert",
    issuer: "LiteSpeed Technologies",
    date: "2022",
    link: "#",
    color: "from-blue-400 to-blue-600"
  },
  {
    title: "Meta Front-End Developer",
    issuer: "Coursera",
    date: "2023",
    link: "#",
    color: "from-blue-600 to-indigo-600"
  }
];

export function Certifications() {
  return (
    <section className="py-24 relative bg-background border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">Certifications & Accolades</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"></div>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <FadeIn key={cert.title} delay={index * 0.1}>
              <TiltCard className="group p-6 h-full bg-secondary/30 border border-white/5 rounded-2xl hover:bg-white/5 transition-all duration-500 cursor-default">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cert.color} p-[1px] transform transition-transform duration-500 group-hover:scale-110`}>
                    <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-20`}></div>
                      <Award size={20} className="relative z-10 text-white" />
                    </div>
                  </div>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300">
                    <ExternalLink size={14} />
                  </a>
                </div>
                
                <h3 className="text-lg font-heading font-bold text-white mb-2">{cert.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">{cert.issuer}</span>
                  <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-md">{cert.date}</span>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
