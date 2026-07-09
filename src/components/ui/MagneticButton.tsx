"use client";

import { useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative inline-flex items-center justify-center rounded-full font-medium transition-colors hover-trigger px-8 py-3 overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-transparent text-foreground hover:bg-border",
    ghost: "bg-transparent text-foreground hover:bg-white/5",
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={disabled ? undefined : handleMouse}
      onMouseLeave={disabled ? undefined : reset}
      onClick={disabled ? undefined : onClick}
      type={type}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${className}`}
    >
      <span className="relative z-10 flex items-center space-x-2">{children}</span>
    </motion.button>
  );
}
