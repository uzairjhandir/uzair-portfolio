"use client";

import { useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Do you only work with WordPress?",
    answer: "No, while I am a WordPress expert, I also specialize in modern JavaScript frameworks like Next.js and React, as well as full server administration (Linux, WHM/cPanel, LiteSpeed)."
  },
  {
    question: "What is your typical turnaround time?",
    answer: "It depends on the project scope. A standard landing page or portfolio takes 1-2 weeks, while a complex custom WooCommerce store or Next.js application might take 4-8 weeks."
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer: "Yes! I offer comprehensive server management and website maintenance retainers to ensure your digital infrastructure remains secure, fast, and up-to-date."
  },
  {
    question: "Can you migrate my site to a new server with zero downtime?",
    answer: "Absolutely. Zero-downtime migrations are my specialty. I handle DNS propagation, database syncing, and SSL installation seamlessly."
  },
  {
    question: "Do you optimize for Core Web Vitals?",
    answer: "Yes, performance is a core pillar of my work. I aim for 100/100 Lighthouse scores through advanced caching, image optimization, and code splitting."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </FadeIn>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div 
                className="border border-border/50 rounded-xl overflow-hidden bg-secondary/20 transition-colors hover:bg-secondary/40 cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-heading font-medium text-foreground pr-8">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-accent shrink-0"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-0 text-muted-foreground leading-relaxed border-t border-border/30 mt-2 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
