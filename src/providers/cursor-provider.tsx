"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCursorStore } from "@/store/cursor";
import { Play } from "lucide-react";
import Image from "next/image";

export function CursorProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { mode, text, image, setMode, resetCursor } = useCursorStore();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Trailing dots
  const trailX1 = useSpring(cursorX, { damping: 30, stiffness: 150, mass: 0.8 });
  const trailY1 = useSpring(cursorY, { damping: 30, stiffness: 150, mass: 0.8 });
  const trailX2 = useSpring(cursorX, { damping: 35, stiffness: 100, mass: 1 });
  const trailY2 = useSpring(cursorY, { damping: 35, stiffness: 100, mass: 1 });

  useEffect(() => {
    // Disable custom cursor on mobile (coarse pointer) or if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    
    if (prefersReducedMotion || isMobile) {
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isPortfolioCard = target.closest(".portfolio-card");
      const isLink = target.tagName.toLowerCase() === "a" || target.closest("a");
      const isButton = target.tagName.toLowerCase() === "button" || target.closest("button");
      
      if (isPortfolioCard) {
        if (mode !== 'text' || text !== 'View') { setMode('text'); useCursorStore.getState().setCursorData({ text: 'View' }); }
      } else if (isLink) {
        if (mode !== 'text' || text !== 'Open') { setMode('text'); useCursorStore.getState().setCursorData({ text: 'Open' }); }
      } else if (isButton) {
        if (mode !== 'text' || text !== 'Click') { setMode('text'); useCursorStore.getState().setCursorData({ text: 'Click' }); }
      } else if (target.classList.contains("hover-trigger")) {
        if (mode !== 'hover' && mode === 'default') setMode('hover');
      } else {
        if (mode !== 'default') resetCursor();
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mode, text, setMode, resetCursor, cursorX, cursorY, isVisible]);

  // Reset hover state on route change
  useEffect(() => {
    resetCursor();
  }, [pathname, resetCursor]);

  const variants = {
    default: {
      height: 32,
      width: 32,
      x: "-50%",
      y: "-50%",
      backgroundColor: "transparent",
      border: "1px solid var(--accent)",
      mixBlendMode: "difference" as React.CSSProperties["mixBlendMode"],
    },
    hover: {
      height: 64,
      width: 64,
      x: "-50%",
      y: "-50%",
      backgroundColor: "var(--accent)",
      border: "none",
      mixBlendMode: "difference" as React.CSSProperties["mixBlendMode"],
      opacity: 0.5,
      scale: 1.2,
    },
    text: {
      height: 80,
      width: 80,
      x: "-50%",
      y: "-50%",
      backgroundColor: "var(--accent)",
      border: "none",
      mixBlendMode: "normal" as React.CSSProperties["mixBlendMode"],
      opacity: 1,
    },
    image: {
      height: 250,
      width: 350,
      x: "-50%",
      y: "-50%",
      backgroundColor: "transparent",
      border: "none",
      mixBlendMode: "normal" as React.CSSProperties["mixBlendMode"],
      opacity: 1,
      borderRadius: "16px",
    },
    video: {
      height: 100,
      width: 100,
      x: "-50%",
      y: "-50%",
      backgroundColor: "var(--accent)",
      border: "none",
      mixBlendMode: "normal" as React.CSSProperties["mixBlendMode"],
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    }
  };

  if (!isVisible) return <>{children}</>;

  return (
    <>
      {/* Trails - only visible in default/hover modes */}
      {(mode === 'default' || mode === 'hover') && (
        <>
          <motion.div
            className="fixed top-0 left-0 rounded-full bg-accent/30 pointer-events-none z-[9998]"
            style={{ x: trailX1, y: trailY1, width: 12, height: 12, translateX: "-50%", translateY: "-50%" }}
          />
          <motion.div
            className="fixed top-0 left-0 rounded-full bg-accent/10 pointer-events-none z-[9997]"
            style={{ x: trailX2, y: trailY2, width: 6, height: 6, translateX: "-50%", translateY: "-50%" }}
          />
        </>
      )}

      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
        style={{ x: cursorXSpring, y: cursorYSpring }}
        variants={variants}
        animate={mode}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      >
        {mode === 'text' && (
          <span className="text-white text-sm font-medium tracking-wider whitespace-nowrap px-4 py-2 text-center pointer-events-none flex flex-col items-center justify-center h-full w-full">
            {text || "View"}
          </span>
        )}
        
        {mode === 'image' && image && (
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            <Image src={image} alt="Preview" fill className="object-cover" />
          </div>
        )}

        {mode === 'video' && (
          <span className="text-white flex flex-col items-center justify-center gap-1">
            <Play size={24} fill="white" />
            <span className="text-[10px] uppercase font-bold tracking-widest">{text || "Play"}</span>
          </span>
        )}
        
        {/* Subtle dot in center for default */}
        {mode === 'default' && (
          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
        )}
      </motion.div>
      {children}
    </>
  );
}
