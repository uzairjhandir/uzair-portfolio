"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Star } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FadeIn } from "@/components/animations/FadeIn";
import { Hero3DLaptop } from "./Hero3DLaptop";
import { TypeAnimation } from "react-type-animation";
import { 
  siNextdotjs, siWordpress, siLaravel, siLinux
} from "simple-icons";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current && containerRef.current) {
        const { left, top } = containerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        gsap.to(spotlightRef.current, {
          x: x,
          y: y,
          duration: 1.5,
          ease: "power3.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Spotlight specific to Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Mouse-Follow Spotlight */}
        <div 
          ref={spotlightRef}
          className="absolute w-[600px] h-[600px] -left-[300px] -top-[300px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen transition-opacity duration-300"
        ></div>
      </div>

      {/* Floating Elements Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block">
        
        {/* Subtle Code Snippet 1 */}
        <motion.div 
          className="absolute top-[20%] left-[5%] opacity-[0.15] font-mono text-[10px] text-cyan-400 whitespace-pre"
          animate={{ y: [0, -10, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {`const optimize = async () => {
  await bundle.minify();
  return { performance: 100 };
};`}
        </motion.div>

        {/* Subtle Code Snippet 2 */}
        <motion.div 
          className="absolute bottom-[20%] right-[10%] opacity-[0.15] font-mono text-[10px] text-purple-400 whitespace-pre"
          animate={{ y: [0, 10, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          {`function PremiumUI() {
  return <Layout glow={true} />;
}`}
        </motion.div>

        {/* Floating Stat Card 1 */}
        <motion.div
          className="absolute top-[30%] right-[8%] glass-panel px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          animate={{ y: [0, -15, 0], rotate: [0, 2, -1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Lighthouse Score</div>
            <div className="text-xl font-bold text-white leading-tight">99 / 100</div>
          </div>
        </motion.div>

        {/* Floating Stat Card 2 */}
        <motion.div
          className="absolute bottom-[35%] right-[45%] glass-panel px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20"
          animate={{ y: [0, 15, 0], rotate: [0, -2, 1, 0] }}
          transition={{ duration: 6, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Load Time</div>
            <div className="text-xl font-bold text-white leading-tight">0.7s</div>
          </div>
        </motion.div>

        {/* Floating Tech Chips */}
        {[
          { name: "Next.js", icon: siNextdotjs, top: "25%", left: "45%", delay: 0 },
          { name: "WordPress", icon: siWordpress, top: "15%", left: "80%", delay: 1 },
          { name: "Laravel", icon: siLaravel, top: "70%", left: "5%", delay: 2 },
          { name: "Linux", icon: siLinux, top: "40%", left: "95%", delay: 1.5 },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="absolute glass-panel px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2 text-white/50"
            style={{ top: item.top, left: item.left }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4 + index,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg role="img" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d={item.icon.path} />
            </svg>
            <span className="text-xs font-medium tracking-wide">{item.name}</span>
          </motion.div>
        ))}
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)] pt-10">
        
        {/* Left Content */}
        <div className="flex flex-col items-start justify-center space-y-8 py-10">
          
          <div className="flex flex-col sm:flex-row gap-4">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-sm font-medium text-white shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-shadow">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span>Available for Freelance</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full glass-panel border border-white/10 text-sm font-medium text-white shadow-[0_0_20px_rgba(234,179,8,0.05)]">
                <div className="flex text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <span>5.0 Client Rating</span>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <h1 className="text-5xl md:text-6xl lg:text-[76px] font-heading font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-2xl">
              Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500">High-Performance</span><br />
              Web Experiences
            </h1>
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-start sm:items-center min-h-[60px]">
            <span className="text-lg md:text-xl font-medium text-muted-foreground mr-2 font-heading">Helping Businesses Scale with</span>
            <TypeAnimation
              sequence={[
                'WordPress', 2000,
                'Next.js', 2000,
                'Laravel', 2000,
                'Cloud Infrastructure', 2000,
                'AI Automation', 2000,
              ]}
              wrapper="span"
              speed={50}
              className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-heading"
              repeat={Infinity}
            />
          </FadeIn>

          <FadeIn delay={0.5} className="flex flex-wrap gap-4 pt-4 relative z-20">
            <MagneticButton onClick={() => window.location.href = "/#portfolio"} className="px-8 py-6 text-base font-semibold shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] border border-primary/50 transition-all">
              <span>View Case Studies</span>
              <ArrowRight size={18} />
            </MagneticButton>
            
            <MagneticButton variant="outline" onClick={() => window.location.href = "/#contact"} className="px-8 py-6 text-base font-semibold border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-all">
              <span>Book Consultation</span>
            </MagneticButton>
          </FadeIn>
        </div>

        {/* Right 3D Content */}
        <FadeIn delay={0.4} direction="left" className="h-[600px] w-full hidden lg:block relative z-10 pointer-events-auto">
          <Hero3DLaptop />
        </FadeIn>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </motion.div>
      </motion.div>

    </section>
  );
}
