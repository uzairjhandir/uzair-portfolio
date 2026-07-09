import { SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {
  variant?: "monogram" | "full" | "wordmark";
}

export function Logo({ variant = "full", className, ...props }: LogoProps) {
  const monogram = (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-auto h-full" {...props}>
      <defs>
        <linearGradient id="mu-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" /> {/* Cyan */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* Blue */}
        </linearGradient>
      </defs>
      {/* Modern M */}
      <path 
        d="M15 70 V30 L35 50 L55 30 V70" 
        stroke="url(#mu-grad)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Modern U */}
      <path 
        d="M75 30 V55 A15 15 0 0 0 105 55 V30" 
        stroke="url(#mu-grad)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Accent Dot */}
      <circle cx="110" cy="80" r="6" fill="url(#mu-grad)" />
    </svg>
  );

  const wordmark = (
    <div className="flex flex-col items-start leading-[0.9]">
      <span className="text-white font-heading font-black tracking-wider text-xl uppercase">Muhammad</span>
      <span className="text-muted-foreground font-heading font-black tracking-[0.2em] text-sm uppercase">Uzair</span>
    </div>
  );

  if (variant === "monogram") {
    return <div className={`flex items-center justify-center ${className}`}>{monogram}</div>;
  }

  if (variant === "wordmark") {
    return <div className={`flex items-center ${className}`}>{wordmark}</div>;
  }

  // Full variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10">{monogram}</div>
      {wordmark}
    </div>
  );
}
