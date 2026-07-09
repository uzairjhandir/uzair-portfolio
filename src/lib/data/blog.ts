export const blogData = [
  {
    slug: "optimize-woocommerce-99-lighthouse",
    title: "How I Optimized WooCommerce to 99 Lighthouse",
    excerpt: "A deep dive into the techniques I used to take a bloated WooCommerce store from a 30 Lighthouse score to a blazing fast 99.",
    heroImage: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "July 12, 2026",
    readingTime: "8 min read",
    category: "Performance",
    tags: ["WooCommerce", "Lighthouse", "Optimization", "Redis"],
    toc: [
      { id: "introduction", title: "Introduction" },
      { id: "the-problem", title: "The Problem with Default WooCommerce" },
      { id: "caching-strategy", title: "Aggressive Caching Strategies" },
      { id: "database-optimization", title: "Database & Redis Object Cache" },
      { id: "conclusion", title: "Conclusion" }
    ],
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>WooCommerce is incredibly powerful, but out of the box, it's not known for speed. When a client approached me with a store taking 6 seconds to load, I knew we had to completely rethink the architecture.</p>
      
      <div class="my-8 p-6 bg-accent/10 border-l-4 border-accent rounded-r-xl">
        <p class="font-semibold text-accent m-0">Key Takeaway:</p>
        <p class="text-white/80 mt-2 text-sm">Performance isn't just about throwing a caching plugin at a site. It requires a holistic approach from the server level down to the frontend code.</p>
      </div>

      <h2 id="the-problem">The Problem with Default WooCommerce</h2>
      <p>Most WooCommerce themes are loaded with unnecessary JavaScript, massive CSS frameworks, and countless DOM elements. Combined with 40+ active plugins, you get a recipe for disastrous Time to First Byte (TTFB) and high Cumulative Layout Shift (CLS).</p>
      
      <p>Here is what the initial Lighthouse report looked like:</p>
      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" alt="Lighthouse before" class="w-full rounded-xl my-8 border border-white/10" />

      <h2 id="caching-strategy">Aggressive Caching Strategies</h2>
      <p>The first step was implementing a server-level cache. We moved from Apache to LiteSpeed Web Server (LSWS). LSWS has built-in page caching specifically optimized for WooCommerce (LiteSpeed Cache for WordPress).</p>
      
      <h3 class="text-xl font-bold mt-8 mb-4 text-white">Bypassing Cache for Cart & Checkout</h3>
      <p>The tricky part of eCommerce caching is dealing with dynamic data. You absolutely cannot cache the cart, checkout, or my account pages. We used Edge Side Includes (ESI) to punch holes in the cached pages, allowing the cart widget to remain dynamic while the rest of the page was served from cache.</p>

      <pre class="bg-[#0A0F1A] p-6 rounded-xl border border-white/10 overflow-x-auto my-6 text-sm text-blue-300"><code>// Example of configuring LiteSpeed ESI for cart widget
define('LSCACHE_ESI_SILENCE', true);
do_action( 'litespeed_control_set_nocache', 'cart-page' );</code></pre>

      <h2 id="database-optimization">Database & Redis Object Cache</h2>
      <p>The next major bottleneck was the database. WooCommerce generates a massive amount of post meta and transient data. By installing Redis Object Cache, we moved all database query results into system RAM.</p>
      
      <ul class="list-disc pl-6 space-y-2 text-muted-foreground my-6">
        <li>Reduced database CPU load by 85%</li>
        <li>Decreased average query time from 120ms to 5ms</li>
        <li>Eliminated deadlocks during high-traffic checkout events</li>
      </ul>

      <h2 id="conclusion">Conclusion</h2>
      <p>By focusing on server architecture, object caching, and stripping away bloated frontend code, we achieved a near-perfect Lighthouse score of 99. The resulting increase in conversion rate paid for the development costs within the first month.</p>
    `
  },
  {
    slug: "nextjs-app-router-best-practices",
    title: "Next.js App Router Best Practices",
    excerpt: "Learn how to structure your Next.js 14 applications using the App Router for maximum performance and maintainability.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "August 05, 2026",
    readingTime: "10 min read",
    category: "Development",
    tags: ["Next.js", "React", "Architecture"],
    toc: [
      { id: "server-components", title: "Embracing Server Components" },
      { id: "data-fetching", title: "Data Fetching Patterns" },
      { id: "layouts", title: "Nested Layouts" }
    ],
    content: `<p>Dummy content for Next.js App Router best practices. This demonstrates the structure of the blog.</p>`
  },
  {
    slug: "wordpress-performance-checklist",
    title: "WordPress Performance Optimization Checklist",
    excerpt: "The ultimate 20-point checklist for auditing and improving the speed of any WordPress website.",
    heroImage: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "August 18, 2026",
    readingTime: "12 min read",
    category: "WordPress",
    tags: ["WordPress", "Speed", "Checklist"],
    toc: [],
    content: `<p>Dummy content for WordPress Performance Optimization.</p>`
  },
  {
    slug: "apache-vs-openlitespeed",
    title: "Apache vs OpenLiteSpeed for WordPress",
    excerpt: "A comprehensive benchmark and comparison of Apache and OpenLiteSpeed web servers for hosting high-traffic WordPress sites.",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "September 02, 2026",
    readingTime: "7 min read",
    category: "Infrastructure",
    tags: ["Server", "LiteSpeed", "Apache", "Hosting"],
    toc: [],
    content: `<p>Dummy content for Apache vs OpenLiteSpeed comparison.</p>`
  },
  {
    slug: "redis-object-cache-explained",
    title: "Redis Object Cache Explained",
    excerpt: "What is object caching, how does Redis work, and why is it mandatory for scaling database-heavy applications?",
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "September 15, 2026",
    readingTime: "6 min read",
    category: "Infrastructure",
    tags: ["Redis", "Database", "Scaling"],
    toc: [],
    content: `<p>Dummy content explaining Redis Object Caching.</p>`
  },
  {
    slug: "server-hardening-whm-cpanel",
    title: "Server Hardening for WHM/cPanel",
    excerpt: "Step-by-step guide to securing a bare-metal WHM/cPanel server against brute force attacks and malware.",
    heroImage: "https://images.unsplash.com/photo-1618477247222-ac60ceb15222?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "October 01, 2026",
    readingTime: "15 min read",
    category: "Security",
    tags: ["Security", "cPanel", "Linux", "Firewall"],
    toc: [],
    content: `<p>Dummy content for WHM server hardening.</p>`
  },
  {
    slug: "migrating-large-woocommerce-stores",
    title: "Migrating Large WooCommerce Stores",
    excerpt: "How to safely migrate an enterprise WooCommerce store with 100,000+ orders and zero downtime.",
    heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "October 20, 2026",
    readingTime: "9 min read",
    category: "DevOps",
    tags: ["WooCommerce", "Migration", "DevOps"],
    toc: [],
    content: `<p>Dummy content for migrating WooCommerce.</p>`
  },
  {
    slug: "image-optimization-strategies",
    title: "Image Optimization Strategies",
    excerpt: "WebP, AVIF, lazy loading, and CDN delivery: the definitive guide to serving perfect images in 2026.",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "November 05, 2026",
    readingTime: "5 min read",
    category: "Performance",
    tags: ["Images", "WebP", "CDN"],
    toc: [],
    content: `<p>Dummy content for image optimization.</p>`
  },
  {
    slug: "laravel-performance-tips",
    title: "Laravel Performance Tips",
    excerpt: "10 actionable tips to speed up your Laravel API and reduce server response times.",
    heroImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "November 18, 2026",
    readingTime: "8 min read",
    category: "Development",
    tags: ["Laravel", "PHP", "Performance"],
    toc: [],
    content: `<p>Dummy content for Laravel optimization.</p>`
  },
  {
    slug: "core-web-vitals-practice",
    title: "Core Web Vitals in Practice",
    excerpt: "Stop guessing. Here is exactly how to fix LCP, FID, and CLS issues on complex dynamic websites.",
    heroImage: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=2000&auto=format&fit=crop",
    author: "Uzair",
    date: "December 01, 2026",
    readingTime: "11 min read",
    category: "SEO",
    tags: ["SEO", "Core Web Vitals", "Lighthouse"],
    toc: [],
    content: `<p>Dummy content for Core Web Vitals.</p>`
  }
];
