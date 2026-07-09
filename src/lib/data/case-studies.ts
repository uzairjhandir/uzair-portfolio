export const caseStudiesData = [
  {
    slug: "enterprise-woocommerce",
    title: "Enterprise WooCommerce Store",
    category: "eCommerce Optimization",
    client: "TechFlow Retail",
    industry: "Consumer Electronics",
    duration: "3 Months",
    teamSize: "2 (Lead Dev, UI/UX Designer)",
    heroImage: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop"
    ],
    overview: "TechFlow Retail approached us with a WooCommerce store that was buckling under the weight of 50,000+ monthly visitors. The site was experiencing 6-second page loads, frequent database crashes during flash sales, and a bloated checkout process that resulted in a high cart abandonment rate.",
    challenge: "The primary challenge was migrating their monolithic, plugin-heavy architecture to a streamlined, performance-oriented stack without causing any downtime. We had to preserve thousands of user accounts, order histories, and complex shipping rules while completely rewriting the front-end theme.",
    solution: "We architected a custom, headless-inspired WooCommerce setup. By migrating the hosting to a highly optimized LiteSpeed enterprise server with Redis object caching, we resolved the database bottlenecks. The frontend was rebuilt using a lightweight custom theme, eliminating reliance on heavy page builders. We also integrated a custom Payment Gateway API to streamline checkout.",
    features: [
      "Custom Lightweight Theme (Zero Page Builders)",
      "Redis Object Caching Integration",
      "Elasticsearch for Instant Product Discovery",
      "Streamlined One-Page Checkout",
      "Automated Inventory Sync API"
    ],
    technologies: ["WordPress", "WooCommerce", "LiteSpeed", "Redis", "PHP 8", "Elasticsearch", "Tailwind CSS"],
    architecture: "The new architecture separates the heavy lifting. Database queries are cached in memory via Redis, while static assets and page HTML are served directly from the LiteSpeed cache layer and Cloudflare Enterprise CDN, reducing server load by 80%.",
    developmentProcess: [
      { step: "Audit & Planning", description: "Deep analysis of the existing codebase, identifying 42 redundant plugins." },
      { step: "Infrastructure Setup", description: "Configured the new LiteSpeed dedicated server with MariaDB and Redis." },
      { step: "Custom Theme Build", description: "Developed a scratch-built, Tailwind-powered WooCommerce theme." },
      { step: "Data Migration", description: "Safely migrated 10,000+ products and 50,000+ orders with zero data loss." },
      { step: "Load Testing", description: "Simulated 5,000 concurrent users to ensure stability during flash sales." }
    ],
    performance: {
      lighthouse: 99,
      seo: 100,
      accessibility: 100,
      bestPractices: 100,
      loadTime: "0.7s",
      ttfb: "120ms"
    },
    beforeAfter: {
      beforeImg: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=1000&auto=format&fit=crop",
      afterImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
    },
    testimonial: {
      quote: "Uzair completely revamped our WooCommerce store, resulting in a 40% increase in sales and blazing fast load times. His understanding of performance architecture is top-tier. We haven't had a single crash since the launch.",
      author: "John Smith",
      role: "CEO, TechFlow"
    },
    results: [
      "Reduced average page load time from 6.2s to 0.7s",
      "Achieved perfect 100/100 Core Web Vitals score",
      "Increased checkout conversion rate by 45%",
      "Server successfully handled 15,000 concurrent users during Black Friday"
    ],
    relatedProjects: ["ai-saas-platform", "server-migration"]
  },
  {
    slug: "ai-saas-platform",
    title: "Next.js AI SaaS Platform",
    category: "Full Stack Web App",
    client: "Nexa AI",
    industry: "Artificial Intelligence",
    duration: "4 Months",
    teamSize: "1 (Full Stack Engineer)",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
    ],
    overview: "Nexa AI needed a highly responsive, enterprise-grade web application to deliver their generative AI models to B2B clients. The platform required a complex tiered subscription model, real-time AI streaming, and an incredibly fast user interface.",
    challenge: "Handling real-time streaming responses from the OpenAI API without blocking the main UI thread was crucial. Furthermore, the application needed a robust data model to track token usage per user across different subscription tiers in real-time.",
    solution: "I developed a Next.js 14 application leveraging the App Router and Server Components for optimal initial load performance. I implemented a custom streaming architecture using Edge Functions to handle AI responses with zero perceived latency. Prisma and PostgreSQL were used for robust data modeling, and Stripe was integrated for seamless subscription management.",
    features: [
      "Real-time AI Chat Interface with Streaming",
      "Stripe Tiered Subscription Management",
      "Granular Token Usage Tracking",
      "OAuth2 and Magic Link Authentication",
      "Dark/Light Mode Premium UI"
    ],
    technologies: ["Next.js 14", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Stripe API", "OpenAI API"],
    architecture: "The app relies heavily on Vercel's Edge Network. API routes handling the OpenAI streaming are deployed to the edge to minimize latency. Database reads are cached heavily, while writes (token consumption) use a queue system to prevent database locking during high traffic.",
    developmentProcess: [
      { step: "Architecture Design", description: "Mapped out the database schema for users, subscriptions, and token logs." },
      { step: "Authentication & Payments", description: "Integrated NextAuth and Stripe webhooks for secure access." },
      { step: "Core AI Engine", description: "Built the Edge functions to handle streaming responses from OpenAI." },
      { step: "UI/UX Implementation", description: "Crafted the chat interface with Framer Motion animations." },
      { step: "Optimization", description: "Reduced client-side JavaScript bundle by 40% using Server Components." }
    ],
    performance: {
      lighthouse: 100,
      seo: 100,
      accessibility: 100,
      bestPractices: 100,
      loadTime: "0.4s",
      ttfb: "45ms"
    },
    beforeAfter: {
      beforeImg: "https://images.unsplash.com/photo-1618477247222-ac60ceb15222?q=80&w=1000&auto=format&fit=crop",
      afterImg: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop"
    },
    testimonial: {
      quote: "The Next.js enterprise application Uzair built for us is a work of art. Clean code, perfect architecture, and great communication throughout the 4-month development cycle.",
      author: "Ahmed Al-Farsi",
      role: "Founder, Nexa AI"
    },
    results: [
      "Successfully launched MVP in under 8 weeks",
      "Acquired 10,000+ active users within the first 3 months",
      "Maintained 99.99% uptime with Vercel edge infrastructure",
      "Achieved $15k MRR within the first quarter"
    ],
    relatedProjects: ["enterprise-woocommerce", "high-traffic-portal"]
  },
  {
    slug: "server-migration",
    title: "Global Server Migration & CI/CD",
    category: "DevOps & Infrastructure",
    client: "CloudScale Media",
    industry: "Digital Agency",
    duration: "1 Month",
    teamSize: "1 (DevOps Consultant)",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618477247222-ac60ceb15222?q=80&w=1000&auto=format&fit=crop"
    ],
    overview: "CloudScale Media, an agency managing over 50 high-traffic client websites, was experiencing frequent server crashes on their outdated shared hosting environment. Deploys were manual via FTP, leading to human errors and inconsistent environments across staging and production.",
    challenge: "The migration of 50+ live production environments needed to happen with absolute zero downtime. Furthermore, the agency's developers needed a modern, automated deployment pipeline to replace their manual FTP uploads.",
    solution: "I architected a highly available, load-balanced infrastructure using dedicated Linux servers. I containerized their critical custom applications using Docker and set up automated CI/CD pipelines via GitHub Actions. Legacy sites were transitioned to a modernized cPanel/WHM environment with strict CloudLinux resource limits.",
    features: [
      "Zero-Downtime Server Migration",
      "GitHub Actions CI/CD Pipelines",
      "Docker Containerization",
      "Automated Daily Offsite Backups",
      "CloudLinux Resource Isolation"
    ],
    technologies: ["Linux", "Docker", "GitHub Actions", "Nginx", "LiteSpeed", "cPanel/WHM", "Bash Scripting"],
    architecture: "A high-availability setup with an Nginx reverse proxy routing traffic to either Docker containers (for Node.js/Python apps) or a tuned LiteSpeed web server (for PHP/WordPress apps). A dedicated database server ensures raw query performance.",
    developmentProcess: [
      { step: "Infrastructure Audit", description: "Mapped all dependencies, DNS records, and server configs." },
      { step: "Server Provisioning", description: "Deployed bare-metal servers and configured the OS, firewalls, and web servers." },
      { step: "Pipeline Setup", description: "Wrote YAML workflows for automated testing and deployment." },
      { step: "Dry-Run Migration", description: "Migrated a staging copy to test performance and iron out bugs." },
      { step: "Live Switch", description: "Updated DNS records globally during off-peak hours with zero dropped requests." }
    ],
    performance: {
      lighthouse: 98,
      seo: 100,
      accessibility: 100,
      bestPractices: 100,
      loadTime: "0.8s",
      ttfb: "85ms"
    },
    beforeAfter: {
      beforeImg: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop",
      afterImg: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop"
    },
    testimonial: {
      quote: "Incredible server administration skills. He migrated our entire infrastructure to LiteSpeed with zero downtime. Highly recommended! We haven't had a single outage since the migration.",
      author: "Sarah Jenkins",
      role: "CTO, CloudScale"
    },
    results: [
      "Executed the migration of 50+ sites with zero reported downtime",
      "Reduced monthly infrastructure costs by 40% through server consolidation",
      "Cut deployment time from hours to minutes with automated pipelines",
      "Eliminated server crashes entirely, achieving 99.99% uptime"
    ],
    relatedProjects: ["enterprise-woocommerce", "high-traffic-portal"]
  },
  {
    slug: "high-traffic-portal",
    title: "High-Traffic News Portal",
    category: "Custom CMS Architecture",
    client: "Daily Echo News",
    industry: "Media & Publishing",
    duration: "6 Months",
    teamSize: "3 (Lead Architect, 2 Frontend Devs)",
    heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop"
    ],
    overview: "A national news portal receiving over 5 million monthly visitors was severely bottlenecked by their legacy monolithic CMS. The site suffered from poor SEO, slow ad loading, and the editorial team struggled with a clunky, outdated publishing interface.",
    challenge: "We needed to rebuild the entire publishing ecosystem. The new system had to handle immense traffic spikes during breaking news events, seamlessly serve programmatic ads without ruining layout shifts (CLS), and provide a modern, React-like authoring experience.",
    solution: "I rebuilt the core architecture using modern PHP 8 and an optimized MySQL database structure. We implemented an aggressive caching strategy using Memcached for database queries and Cloudflare Enterprise CDN for edge-level HTML caching. The editorial interface was replaced with a custom, block-based Gutenberg integration.",
    features: [
      "Headless-Ready API Architecture",
      "Edge HTML Caching via Cloudflare",
      "Custom Block-Based Editorial Interface",
      "Optimized Ad Bidding Sequences",
      "Automated Image WebP Conversion"
    ],
    technologies: ["PHP 8", "MySQL", "Memcached", "Cloudflare CDN", "React", "WordPress Core"],
    architecture: "An edge-first approach. 95% of traffic never hits the origin server. Anonymous requests are served directly from Cloudflare's edge nodes. Authenticated requests and editorial operations are routed to the origin server, which uses Memcached to reduce database load.",
    developmentProcess: [
      { step: "Data Modeling", description: "Restructured the database to remove 10 years of legacy bloat." },
      { step: "API Development", description: "Built custom REST endpoints for the mobile app team." },
      { step: "Frontend Rebuild", description: "Developed a vanilla JS and CSS frontend to minimize bundle sizes." },
      { step: "Ad Integration", description: "Implemented lazy-loaded ad slots to fix Cumulative Layout Shift." },
      { step: "Edge Caching", description: "Configured complex Cloudflare Page Rules to maximize cache hit rates." }
    ],
    performance: {
      lighthouse: 95,
      seo: 100,
      accessibility: 98,
      bestPractices: 100,
      loadTime: "0.9s",
      ttfb: "60ms"
    },
    beforeAfter: {
      beforeImg: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1000&auto=format&fit=crop",
      afterImg: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1000&auto=format&fit=crop"
    },
    testimonial: {
      quote: "Our organic traffic has soared by 30% since Google recognized the speed improvements. Uzair fixed our Core Web Vitals issues in a single day, and the new CMS is a joy for our writers.",
      author: "Emily Chen",
      role: "Digital Director, Daily Echo"
    },
    results: [
      "Reduced Time to First Byte (TTFB) from 800ms to consistently under 100ms globally",
      "Increased ad revenue by 30% through optimized ad-loading sequences",
      "Improved editorial publishing speed by 2x",
      "Decreased bounce rate by 25% due to significantly improved UX"
    ],
    relatedProjects: ["ai-saas-platform", "enterprise-woocommerce"]
  }
];
