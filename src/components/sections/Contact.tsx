"use client";

import { useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { TiltCard } from "@/components/ui/TiltCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  project: z.string().min(1, "Please select a project type"),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      // Simulate API call for now (this would normally hit a Next.js API route using Resend)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form data:", data);
      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };


  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="lg:w-5/12">
            <FadeIn>
              <div className="text-accent font-mono text-sm font-bold tracking-widest mb-3 uppercase flex items-center gap-2">
                <span className="w-8 h-px bg-accent"></span>
                CONTACT
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-4 text-white leading-tight drop-shadow-lg">
                Let&apos;s Build Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Website.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mb-12">
                Ready to take your digital presence to the next level? Fill out the form and I&apos;ll get back to you within 24 hours.
              </p>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white">Fast Delivery</h4>
                    <p className="text-sm text-muted-foreground">On-time project completion</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white">Clean Code</h4>
                    <p className="text-sm text-muted-foreground">Maintainable & scalable architecture</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white">SEO Optimized</h4>
                    <p className="text-sm text-muted-foreground">Built to rank on search engines</p>
                  </div>
                </div>
              </div>

              {/* Direct Contact Options */}
              <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366] hover:text-white transition-all font-semibold hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:-translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>WhatsApp</span>
                </a>
                <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>Book Call</span>
                </a>
              </div>
              
              <div className="mt-4">
                <a href="/resume.pdf" download className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all font-semibold hover:-translate-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  <span>Download Resume</span>
                </a>
              </div>
            </FadeIn>
          </div>

          <div className="lg:w-7/12">
            <FadeIn delay={0.2} direction="left">
              <TiltCard className="p-8 md:p-12 bg-[#0A0F1A]/80 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input 
                        {...register("name")} 
                        id="name"
                        className="peer w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground placeholder-transparent focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300" 
                        placeholder="John Doe" 
                      />
                      <label htmlFor="name" className="absolute left-4 top-2 text-xs font-medium text-muted-foreground transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent">Name *</label>
                      {errors.name && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.name.message}</p>}
                    </div>
                    <div className="relative group">
                      <input 
                        {...register("email")} 
                        id="email"
                        className="peer w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground placeholder-transparent focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300" 
                        placeholder="john@example.com" 
                      />
                      <label htmlFor="email" className="absolute left-4 top-2 text-xs font-medium text-muted-foreground transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent">Email *</label>
                      {errors.email && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="relative group">
                      <input 
                        {...register("phone")} 
                        id="phone"
                        className="peer w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground placeholder-transparent focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300" 
                        placeholder="+1 234 567 890" 
                      />
                      <label htmlFor="phone" className="absolute left-4 top-2 text-xs font-medium text-muted-foreground transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent">Phone (Optional)</label>
                    </div>
                    <div className="relative group">
                      <select 
                        {...register("project")} 
                        id="project"
                        className="w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300 appearance-none"
                      >
                        <option value="" disabled hidden></option>
                        <option value="wordpress" className="bg-background">WordPress Website</option>
                        <option value="woocommerce" className="bg-background">WooCommerce Store</option>
                        <option value="nextjs" className="bg-background">Next.js Application</option>
                        <option value="server" className="bg-background">Server Management</option>
                        <option value="optimization" className="bg-background">Speed Optimization</option>
                      </select>
                      <label htmlFor="project" className="absolute left-4 top-2 text-xs font-medium text-accent transition-all duration-300">Project Type *</label>
                      {errors.project && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.project.message}</p>}
                    </div>
                  </div>

                  <div className="relative group pt-2">
                    <select 
                      {...register("budget")} 
                      id="budget"
                      className="w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300 appearance-none"
                    >
                      <option value="" disabled hidden></option>
                      <option value="<1k" className="bg-background">Less than $1,000</option>
                      <option value="1k-5k" className="bg-background">$1,000 - $5,000</option>
                      <option value="5k-10k" className="bg-background">$5,000 - $10,000</option>
                      <option value=">10k" className="bg-background">$10,000+</option>
                    </select>
                    <label htmlFor="budget" className="absolute left-4 top-2 text-xs font-medium text-accent transition-all duration-300">Budget Range</label>
                  </div>

                  <div className="relative group pt-2">
                    <textarea 
                      {...register("message")} 
                      id="message"
                      rows={4} 
                      className="peer w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground placeholder-transparent focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300 resize-none" 
                      placeholder="Tell me about your project..."
                    ></textarea>
                    <label htmlFor="message" className="absolute left-4 top-2 text-xs font-medium text-muted-foreground transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent">Message *</label>
                    {errors.message && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.message.message}</p>}
                  </div>

                  <div className="pt-6">
                    <MagneticButton type="submit" className="w-full py-5 text-lg font-bold group">
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={20} className="ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </MagneticButton>
                    <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      Usually replies within a few hours
                    </p>
                  </div>

                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center space-x-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                      >
                        <CheckCircle2 size={24} className="shrink-0" />
                        <span className="font-medium">Message sent successfully! I will get back to you soon.</span>
                      </motion.div>
                    )}
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center space-x-3 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                      >
                        <AlertCircle size={24} className="shrink-0" />
                        <span className="font-medium">Something went wrong. Please try again later.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </TiltCard>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
