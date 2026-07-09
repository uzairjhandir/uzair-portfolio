"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { MagneticButton } from "@/components/ui/MagneticButton";

import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Portfolio", href: "/#portfolio" },
  { name: "Blog", href: "/blog" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 z-[60] origin-left shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        style={{ scaleX }}
      />
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0A0F1A]/80 backdrop-blur-2xl border-b border-white/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="hover-trigger transition-transform hover:scale-105" aria-label="Home">
            <Logo variant="full" className="h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname === '/' && link.href.startsWith('/#') && link.href !== '/');
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-2 group hover-trigger rounded-full transition-colors"
                >
                  <span className={`text-sm font-medium transition-colors duration-300 relative z-10 ${
                    isActive ? "text-white" : "text-white/70 group-hover:text-white"
                  }`}>
                    {link.name}
                  </span>
                  
                  {/* Active Indicator / Hover Animation */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-95 group-hover:scale-100 duration-300" />
                </Link>
              );
            })}
            
            <div className="pl-6">
              <MagneticButton onClick={() => window.location.href = "/#contact"} className="px-6 py-2.5 text-sm font-semibold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                Hire Me
              </MagneticButton>
            </div>
          </nav>

          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden text-white hover:text-accent relative z-[60] transition-transform hover:scale-110"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
              animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
              exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="md:hidden fixed inset-0 top-0 left-0 bg-[#0A0F1A]/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center space-y-8"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-4xl font-heading font-bold text-white/80 hover:text-white transition-colors relative group"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                    <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-blue-400 to-purple-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.1 }}
                className="pt-8"
              >
                <MagneticButton onClick={() => { setIsOpen(false); window.location.href = "/#contact"; }} className="px-8 py-4 text-lg">
                  Hire Me Now
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
