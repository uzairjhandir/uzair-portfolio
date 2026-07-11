"use client";

import { useRef, useEffect } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { TiltCard } from "@/components/ui/TiltCard";
import { Star, Quote } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";

const testimonials = [
  {
    name: "John Smith",
    role: "CEO, TechFlow",
    country: "USA",
    flag: "🇺🇸",
    project: "eCommerce Optimization",
    tech: ["WordPress", "WooCommerce", "Redis"],
    rating: 5,
    review: "Uzair is an absolute professional. He completely revamped our WooCommerce store, resulting in a 40% increase in sales and blazing fast load times. His understanding of performance architecture is top-tier.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Sarah Jenkins",
    role: "CTO, CloudScale",
    country: "UK",
    flag: "🇬🇧",
    project: "Server Migration",
    tech: ["Linux", "LiteSpeed", "Docker"],
    rating: 5,
    review: "Incredible server administration skills. He migrated our entire infrastructure to LiteSpeed with zero downtime. Highly recommended! We haven't had a single outage since the migration.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Ahmed Al-Farsi",
    role: "Founder, Nexa",
    country: "UAE",
    flag: "🇦🇪",
    project: "Next.js SaaS",
    tech: ["Next.js", "React", "Node.js"],
    rating: 5,
    review: "The Next.js enterprise application Uzair built for us is a work of art. Clean code, perfect architecture, and great communication throughout the 4-month development cycle.",
    image: "https://randomuser.me/api/portraits/men/67.jpg"
  },
  {
    name: "Emily Chen",
    role: "Marketing Dir.",
    country: "Canada",
    flag: "🇨🇦",
    project: "Core Web Vitals",
    tech: ["WordPress", "Performance"],
    rating: 5,
    review: "Best WordPress expert I've hired on Upwork. Fixed our Core Web Vitals issues in a single day. Our organic traffic has soared by 30% since Google recognized the speed improvements.",
    image: "https://randomuser.me/api/portraits/women/90.jpg"
  }
];

export function Testimonials() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section id="testimonials" className="py-24 relative bg-transparent overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <FadeIn>
            <div className="text-accent font-mono text-sm font-bold tracking-widest mb-3 uppercase flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-accent"></span>
              CLIENT FEEDBACK
              <span className="w-8 h-px bg-accent"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
              What People <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Are Saying.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Don&apos;t just take my word for it. Here is what my clients have experienced working with me.
            </p>
          </FadeIn>
        </div>

        {/* Auto Slider */}
        <div className="relative max-w-[1400px] mx-auto">
          {/* Gradients for fade effect on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          <div className="flex overflow-hidden py-8 -mx-4 px-4">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
              className="flex gap-8 w-max"
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={index} className="w-[420px] md:w-[540px] shrink-0">
                  <TiltCard className="h-full bg-[#0A0F1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 flex flex-col relative group hover:border-white/30 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                    
                    <Quote className="text-accent/10 absolute top-8 right-8 transition-colors group-hover:text-accent/20" size={80} />
                    
                    <div className="flex items-center space-x-1 mb-8">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={20} className="fill-yellow-500 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground leading-loose text-lg flex-grow mb-10 relative z-10">
                      &quot;{testimonial.review}&quot;
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/10 pt-8 mt-auto gap-6">
                      <div className="flex items-center space-x-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary/50 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                        />
                        <div>
                          <h4 className="font-heading font-semibold text-white text-xl flex items-center gap-2 mb-1">
                            {testimonial.name}
                            <span className="text-sm bg-white/5 px-2 py-0.5 rounded border border-white/10">{testimonial.flag}</span>
                          </h4>
                          <span className="text-accent font-medium text-sm block">{testimonial.role}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 whitespace-nowrap">
                          {testimonial.project}
                        </span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {testimonial.tech.map((t, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
