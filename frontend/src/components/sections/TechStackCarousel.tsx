"use client";

import Marquee from "react-fast-marquee";
import { 
  siWordpress, siNextdotjs, siReact, siLaravel, 
  siPhp, siMysql, siCloudflare, siLinux, 
  siDocker, siGithub, siTailwindcss, siNodedotjs 
} from "simple-icons";

const technologies = [
  siWordpress,
  siNextdotjs,
  siReact,
  siTailwindcss,
  siNodedotjs,
  siPhp,
  siLaravel,
  siMysql,
  siCloudflare,
  siLinux,
  siDocker,
  siGithub
];

export function TechStackCarousel() {
  return (
    <section className="py-16 border-y border-white/5 bg-background overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 mb-8">
        <h3 className="text-center text-sm font-medium tracking-widest text-muted-foreground uppercase">Powering Digital Experiences With</h3>
      </div>

      <Marquee speed={40} gradient={false} pauseOnHover={true}>
        <div className="flex gap-16 md:gap-24 items-center pl-16 md:pl-24">
          {technologies.map((tech) => (
            <div 
              key={tech.title} 
              className="flex flex-col items-center gap-3 group cursor-pointer hover-trigger"
              onClick={() => window.open(`https://www.google.com/search?q=${tech.title}`, '_blank')}
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="w-12 h-12 transition-all duration-500 opacity-40 group-hover:opacity-100 group-hover:-translate-y-2"
                style={{ fill: "currentColor" }}
              >
                <path d={tech.path} />
                <style jsx>{`
                  svg:hover {
                    fill: #${tech.hex};
                    filter: drop-shadow(0 0 10px #${tech.hex}80);
                  }
                `}</style>
              </svg>
              <span className="text-sm font-medium text-transparent group-hover:text-white transition-colors duration-300">
                {tech.title}
              </span>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
