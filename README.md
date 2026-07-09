# Muhammad Uzair — Portfolio v1.0.0

A premium, agency-level personal portfolio website engineered for performance, SEO, and conversion. Built with the Next.js 16 App Router and Turbopack.

## 🚀 Status: Production Ready (v1.0.0)

This repository contains the frozen source code for v1.0.0. The architecture is complete, and the design system is fully implemented.

### Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + Glassmorphism 
- **Animations:** Framer Motion
- **Icons:** Lucide React & Simple Icons
- **Content:** Local Data Providers (Case Studies & Blog)
- **SEO:** Automated JSON-LD Schema, Dynamic Sitemap, Robots.txt
- **Analytics:** Google Analytics 4, Microsoft Clarity, Meta Pixel
- **Chat:** Tawk.to / Crisp (Dynamic Environment Variable loading)

## 📦 Environment Setup

To run this project locally, copy the `.env.example` to `.env.local` and populate the fields:

```bash
NEXT_PUBLIC_SITE_URL=https://uzair.dev

# Analytics (Optional but Recommended)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_META_PIXEL_ID=

# Webmaster Verification (Optional)
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=

# Chat Widgets (Set NEXT_PUBLIC_CHAT_PROVIDER to 'tawk' or 'crisp')
NEXT_PUBLIC_CHAT_PROVIDER=tawk
NEXT_PUBLIC_TAWK_PROPERTY_ID=
NEXT_PUBLIC_TAWK_WIDGET_ID=
NEXT_PUBLIC_CRISP_WEBSITE_ID=
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
npm start
```

## 📝 Roadmap (Post v1.0.0)

The next steps for this repository include:
- **v1.0.1** - Content integration (real images, real resume PDF, real testimonials).
- **v1.1.0** - Potential API integrations (Resend/EmailJS for contact form).
- **v2.0.0** - Headless CMS integration and Client Portal.

## 📄 License
MIT License
