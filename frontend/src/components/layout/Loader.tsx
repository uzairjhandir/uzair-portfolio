"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Logo } from "@/components/ui/Logo";

export function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";
    
    // Simulate loading progress
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "";
          }, 500);
        }
      });

      tl.to({ value: 0 }, {
        value: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function() {
          setProgress(Math.round(this.targets()[0].value));
        }
      });
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Noise overlay for premium feel */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo variant="monogram" className="w-24 h-24 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
            </motion.div>

            {/* Progress Bar Container */}
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Progress Number */}
            <div className="text-sm font-mono text-white/50 tracking-widest">
              {progress.toString().padStart(3, '0')}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
