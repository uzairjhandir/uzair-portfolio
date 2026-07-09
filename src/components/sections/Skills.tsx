"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import Marquee from "react-fast-marquee";
import { 
  siWordpress, siWoocommerce, siReact, siNextdotjs, siTailwindcss, 
  siLaravel, siPhp, siNodedotjs, siMysql, siRedis, siDocker, 
  siLinux, siGit, siGithub, siCloudflare, siTypescript, siJavascript, 
  siHtml5, siCss 
} from 'simple-icons';

const techLogos = [
  { name: "WordPress", icon: siWordpress, color: "#21759B" },
  { name: "WooCommerce", icon: siWoocommerce, color: "#96588A" },
  { name: "React", icon: siReact, color: "#61DAFB" },
  { name: "Next.js", icon: siNextdotjs, color: "#FFFFFF" },
  { name: "Tailwind", icon: siTailwindcss, color: "#06B6D4" },
  { name: "Laravel", icon: siLaravel, color: "#FF2D20" },
  { name: "PHP", icon: siPhp, color: "#777BB4" },
  { name: "Node.js", icon: siNodedotjs, color: "#5FA04E" },
  { name: "MySQL", icon: siMysql, color: "#4479A1" },
  { name: "Redis", icon: siRedis, color: "#DC382D" },
  { name: "Docker", icon: siDocker, color: "#2496ED" },
  { name: "Linux", icon: siLinux, color: "#FCC624" },
  { name: "Git", icon: siGit, color: "#F05032" },
  { name: "GitHub", icon: siGithub, color: "#FFFFFF" },
  { name: "Cloudflare", icon: siCloudflare, color: "#F38020" },
  { name: "TypeScript", icon: siTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: siJavascript, color: "#F7DF1E" },
  { name: "HTML5", icon: siHtml5, color: "#E34F26" },
  { name: "CSS3", icon: siCss, color: "#1572B6" },
];

function TechCard({ tech }: { tech: typeof techLogos[0] }) {
  return (
    <div className="group relative mx-6 flex items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-transparent transition-all duration-300 w-32 h-32 hover:scale-115 hover:-rotate-3 hover:bg-white/10 cursor-pointer" style={{ boxShadow: 'none' }} 
         onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 0 30px ${tech.color}40`;
            e.currentTarget.style.borderColor = `${tech.color}50`;
         }}
         onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
         }}>
      
      {/* Tooltip */}
      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 translate-y-2 group-hover:translate-y-0">
        <div 
          className="text-xs font-bold px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap text-white border"
          style={{ backgroundColor: "#0A0F1A", borderColor: `${tech.color}50` }}
        >
          {tech.name}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-b border-r" style={{ backgroundColor: "#0A0F1A", borderColor: `${tech.color}50` }}></div>
        </div>
      </div>

      <svg 
        role="img" 
        viewBox="0 0 24 24" 
        width={48} 
        height={48} 
        xmlns="http://www.w3.org/2000/svg"
        fill={tech.color}
        className="transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
      >
        <title>{tech.icon.title}</title>
        <path d={tech.icon.path} />
      </svg>
    </div>
  );
}

export function Skills() {
  const row1 = techLogos.slice(0, Math.ceil(techLogos.length / 2));
  const row2 = techLogos.slice(Math.ceil(techLogos.length / 2));

  return (
    <section id="skills" className="py-24 relative bg-transparent border-t border-white/5 overflow-hidden">
      {/* Radial blur behind heading */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 rounded-[100%] blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 relative">
          <FadeIn>
            <div className="text-accent font-mono text-sm font-bold tracking-widest mb-3 uppercase flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-accent"></span>
              TECHNOLOGY STACK
              <span className="w-8 h-px bg-accent"></span>
            </div>
            {/* Added relative and pseudo-elements for radial light effect if needed, but absolute glow div is enough */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
              Tools & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Technologies.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A curated stack of modern frameworks and robust infrastructure to build end-to-end, high-performance solutions.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="w-full relative z-10 flex flex-col gap-8 pb-10">
        {/* Row 1 - Moves Left */}
        <Marquee speed={40} gradient={true} gradientColor="#050B14" gradientWidth={100} pauseOnHover={true}>
          <div className="flex px-4 py-4">
            {row1.map((tech) => (
              <TechCard key={tech.name} tech={tech} />
            ))}
          </div>
        </Marquee>

        {/* Row 2 - Moves Right */}
        <Marquee speed={35} gradient={true} gradientColor="#050B14" gradientWidth={100} pauseOnHover={true} direction="right">
          <div className="flex px-4 py-4">
            {row2.map((tech) => (
              <TechCard key={tech.name} tech={tech} />
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}
