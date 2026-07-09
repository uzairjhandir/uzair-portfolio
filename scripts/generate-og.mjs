import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const wordmarkSvg = `
<svg viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#0A0F1A" />
      <stop offset="100%" stopColor="#0B1727" />
    </linearGradient>
    
    <!-- Logo Gradient -->
    <linearGradient id="mu-grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#06B6D4" />
      <stop offset="100%" stopColor="#3B82F6" />
    </linearGradient>
    
    <!-- Glow -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg-grad)" />
  
  <!-- Subtle Grid -->
  <path d="M0 100 L1200 100 M0 200 L1200 200 M0 300 L1200 300 M0 400 L1200 400 M0 500 L1200 500 M0 600 L1200 600" stroke="rgba(255,255,255,0.02)" stroke-width="2" />
  <path d="M100 0 L100 630 M200 0 L200 630 M300 0 L300 630 M400 0 L400 630 M500 0 L500 630 M600 0 L600 630 M700 0 L700 630 M800 0 L800 630 M900 0 L900 630 M1000 0 L1000 630 M1100 0 L1100 630" stroke="rgba(255,255,255,0.02)" stroke-width="2" />

  <!-- Center Content -->
  <g transform="translate(320, 150)">
    <!-- Glow effect behind the logo -->
    <circle cx="280" cy="150" r="100" fill="#3B82F6" opacity="0.2" filter="url(#glow)" />
    
    <!-- Monogram -->
    <g transform="translate(100, 40) scale(2)">
      <path d="M15 80 V40 L35 60 L55 40 V80" stroke="url(#mu-grad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M75 40 V65 A15 15 0 0 0 105 65 V40" stroke="url(#mu-grad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="110" cy="90" r="6" fill="url(#mu-grad)" />
    </g>
    
    <!-- Wordmark Below -->
    <g transform="translate(50, 300)" font-family="system-ui, -apple-system, sans-serif" font-weight="900" text-anchor="middle">
      <text x="230" y="0" fill="#FFFFFF" letter-spacing="4" font-size="48">MUHAMMAD</text>
      <text x="230" y="40" fill="#888888" letter-spacing="12" font-size="28">UZAIR</text>
    </g>
    
    <text x="280" y="380" fill="#3B82F6" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="20" text-anchor="middle" letter-spacing="2">FULL STACK DEVELOPER</text>
  </g>
</svg>
`;

async function generate() {
  console.log('Generating OG Image...');
  await sharp(Buffer.from(wordmarkSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(PUBLIC_DIR, 'og-image.jpg'));
  console.log('OG Image generated!');
}

generate().catch(console.error);
