import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

// Ensure the public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Center the MU Monogram in a 120x120 perfect square for icons
const rawSvg = `
<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mu-grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#06B6D4" />
      <stop offset="100%" stopColor="#3B82F6" />
    </linearGradient>
  </defs>
  <path 
    d="M15 80 V40 L35 60 L55 40 V80" 
    stroke="url(#mu-grad)" 
    stroke-width="10" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
  />
  <path 
    d="M75 40 V65 A15 15 0 0 0 105 65 V40" 
    stroke="url(#mu-grad)" 
    stroke-width="10" 
    stroke-linecap="round" 
    stroke-linejoin="round" 
  />
  <circle cx="110" cy="90" r="6" fill="url(#mu-grad)" />
</svg>
`;

const wordmarkSvg = `
<svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mu-grad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#06B6D4" />
      <stop offset="100%" stopColor="#3B82F6" />
    </linearGradient>
  </defs>
  <!-- Monogram -->
  <g transform="translate(0, 0)">
    <path d="M15 80 V40 L35 60 L55 40 V80" stroke="url(#mu-grad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M75 40 V65 A15 15 0 0 0 105 65 V40" stroke="url(#mu-grad)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="110" cy="90" r="6" fill="url(#mu-grad)" />
  </g>
  
  <!-- Wordmark -->
  <g transform="translate(140, 60)" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="32">
    <text x="0" y="0" fill="#FFFFFF" letter-spacing="2">MUHAMMAD</text>
    <text x="0" y="24" fill="#888888" letter-spacing="8" font-size="20">UZAIR</text>
  </g>
</svg>
`;

const wordmarkLightSvg = wordmarkSvg.replace('fill="#FFFFFF"', 'fill="#000000"');

async function generate() {
  console.log('Generating SVG assets...');
  
  // 1. Write the raw SVGs
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.svg'), wordmarkSvg);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo-dark.svg'), wordmarkSvg);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo-light.svg'), wordmarkLightSvg);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), rawSvg);

  const svgBuffer = Buffer.from(rawSvg);

  // 2. Generate PNGs
  console.log('Generating PNG favicons...');
  
  // apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

  // android-chrome-192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'android-chrome-192.png'));

  // android-chrome-512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'android-chrome-512.png'));

  // 32x32 for standard favicon.ico (since sharp doesn't output true .ico, we will output a 32x32 png, rename it or create a multi-layer ico)
  // Actually modern browsers accept a .ico that is just a renamed .png or .png file inside it.
  // Wait, sharp can't output .ico directly. We'll generate a 32x32 PNG and write a minimal valid ICO header if needed, or simply name it favicon.ico. Many browsers support a PNG renamed to .ico.
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), png32);

  // Write site.webmanifest
  const manifest = {
    name: "Muhammad Uzair — Portfolio",
    short_name: "Uzair",
    icons: [
      {
        src: "/android-chrome-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#0A0F1A",
    background_color: "#0A0F1A",
    display: "standalone"
  };

  fs.writeFileSync(path.join(PUBLIC_DIR, 'site.webmanifest'), JSON.stringify(manifest, null, 2));

  console.log('All branding assets generated successfully!');
}

generate().catch(console.error);
