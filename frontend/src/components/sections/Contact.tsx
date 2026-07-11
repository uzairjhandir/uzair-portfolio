"use client";

import { useState, useEffect, useRef } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { TiltCard } from "@/components/ui/TiltCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Send, CheckCircle2, AlertCircle, Globe, Award, Users, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateLeadMutation } from "@/lib/query/crm/mutations";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  project: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honey: z.string().max(0, "Invalid submission"), // Honeypot
});

type FormData = z.infer<typeof formSchema>;

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const mountedTime = useRef<number>(0);

  useEffect(() => {
    mountedTime.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync: createLead } = useCreateLeadMutation();

  const onSubmit = async (data: FormData) => {
    // Check submission time to prevent instant bot submissions (min 3 seconds)
    // eslint-disable-next-line react-hooks/purity
    if (Date.now() - mountedTime.current < 3000 || data.honey) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      await createLead(data);
      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
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
              <div className="text-muted-foreground text-lg max-w-xl mb-12 space-y-4">
                <p>Ready to take your digital presence to the next level? Fill out the form and let&apos;s discuss your requirements.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-medium text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Average response time: Under 2 Hours ⚡
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <Briefcase className="text-blue-400 mb-2" size={28} />
                  <span className="font-heading font-bold text-white text-xl">350+</span>
                  <span className="text-xs text-muted-foreground">Projects Delivered</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <Users className="text-purple-400 mb-2" size={28} />
                  <span className="font-heading font-bold text-white text-xl">100+</span>
                  <span className="text-xs text-muted-foreground">Happy Clients</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <Award className="text-emerald-400 mb-2" size={28} />
                  <span className="font-heading font-bold text-white text-xl">8+</span>
                  <span className="text-xs text-muted-foreground">Years Experience</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                  <Globe className="text-cyan-400 mb-2" size={28} />
                  <span className="font-heading font-bold text-white text-xl">Global</span>
                  <span className="text-xs text-muted-foreground">Available Worldwide</span>
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
              <TiltCard className="p-8 md:p-12 bg-[#0A0F1A]/80 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {submitStatus === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center py-12"
                    >
                      <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-3xl font-heading font-bold text-white mb-4">Thank You!</h3>
                      <p className="text-muted-foreground text-lg mb-2">Your project inquiry has been received.</p>
                      <p className="text-muted-foreground mb-8">I&apos;ll review everything carefully. Usually I reply within 2–6 hours.</p>
                      
                      <div className="p-6 bg-white/5 border border-white/10 rounded-xl w-full max-w-sm">
                        <p className="text-sm text-white/70 mb-4">Need urgent help?</p>
                        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#1EBE5D] transition-colors shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                          Chat on WhatsApp
                        </a>
                      </div>
                      
                      <button 
                        onClick={() => setSubmitStatus("idle")}
                        className="mt-8 text-sm text-accent hover:text-white transition-colors underline underline-offset-4"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      // eslint-disable-next-line react-hooks/refs
                      onSubmit={handleSubmit(onSubmit)} 
                      className="space-y-6"
                    >
                      {/* Honeypot Field */}
                      <input type="text" {...register("honey")} className="hidden" aria-hidden="true" tabIndex={-1} />

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
                            {...register("company")} 
                            id="company"
                            className="peer w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground placeholder-transparent focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300" 
                            placeholder="Acme Inc." 
                          />
                          <label htmlFor="company" className="absolute left-4 top-2 text-xs font-medium text-muted-foreground transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent">Company Name (Optional)</label>
                        </div>
                        <div className="relative group">
                          <input 
                            {...register("phone")} 
                            id="phone"
                            className="peer w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground placeholder-transparent focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300" 
                            placeholder="+1 234 567 890" 
                          />
                          <label htmlFor="phone" className="absolute left-4 top-2 text-xs font-medium text-muted-foreground transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent">Phone (Optional)</label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="relative group">
                          <select 
                            {...register("project")} 
                            id="project"
                            className="w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300 appearance-none"
                            defaultValue=""
                          >
                            <option value="" disabled hidden></option>
                            <option value="WordPress Website" className="bg-background">WordPress Website</option>
                            <option value="WooCommerce Store" className="bg-background">WooCommerce Store</option>
                            <option value="Next.js Application" className="bg-background">Next.js Application</option>
                            <option value="Laravel Application" className="bg-background">Laravel Application</option>
                            <option value="Website Optimization" className="bg-background">Website Optimization</option>
                            <option value="Server Administration" className="bg-background">Server Administration</option>
                            <option value="Website Migration" className="bg-background">Website Migration</option>
                            <option value="Monthly Maintenance" className="bg-background">Monthly Maintenance</option>
                            <option value="Other" className="bg-background">Other</option>
                          </select>
                          <label htmlFor="project" className="absolute left-4 top-2 text-xs font-medium text-accent transition-all duration-300">Project Type *</label>
                          {errors.project && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.project.message}</p>}
                        </div>
                        <div className="relative group">
                          <select 
                            {...register("budget")} 
                            id="budget"
                            className="w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300 appearance-none"
                            defaultValue=""
                          >
                            <option value="" disabled hidden></option>
                            <option value="Under $500" className="bg-background">Under $500</option>
                            <option value="$500 - $1,000" className="bg-background">$500 – $1,000</option>
                            <option value="$1,000 - $3,000" className="bg-background">$1,000 – $3,000</option>
                            <option value="$3,000 - $5,000" className="bg-background">$3,000 – $5,000</option>
                            <option value="$5,000+" className="bg-background">$5,000+</option>
                            <option value="Let's Discuss" className="bg-background">Let&apos;s Discuss</option>
                          </select>
                          <label htmlFor="budget" className="absolute left-4 top-2 text-xs font-medium text-accent transition-all duration-300">Budget Range *</label>
                          {errors.budget && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.budget.message}</p>}
                        </div>
                      </div>

                      <div className="relative group pt-2">
                        <select 
                          {...register("timeline")} 
                          id="timeline"
                          className="w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300 appearance-none"
                          defaultValue=""
                        >
                          <option value="" disabled hidden></option>
                          <option value="Immediately" className="bg-background">Immediately</option>
                          <option value="Within 1 Week" className="bg-background">Within 1 Week</option>
                          <option value="Within 1 Month" className="bg-background">Within 1 Month</option>
                          <option value="Flexible" className="bg-background">Flexible</option>
                        </select>
                        <label htmlFor="timeline" className="absolute left-4 top-2 text-xs font-medium text-accent transition-all duration-300">Expected Timeline *</label>
                        {errors.timeline && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.timeline.message}</p>}
                      </div>

                      <div className="relative group pt-2">
                        <textarea 
                          {...register("message")} 
                          id="message"
                          rows={4} 
                          className="peer w-full bg-[#050B14]/80 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-foreground placeholder-transparent focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:bg-[#0A192F]/80 transition-all duration-300 resize-none" 
                          placeholder="Tell me about your project..."
                        ></textarea>
                        <label htmlFor="message" className="absolute left-4 top-2 text-xs font-medium text-muted-foreground transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent">Project Details *</label>
                        {errors.message && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.message.message}</p>}
                      </div>

                      <div className="pt-6">
                        <MagneticButton type="submit" className="w-full py-5 text-lg font-bold group" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Sending your project inquiry... ⏳</span>
                            </div>
                          ) : (
                            <>
                              <span>Start Your Project</span>
                              <Send size={20} className="ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </MagneticButton>
                      </div>

                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center space-x-3 mt-4"
                        >
                          <AlertCircle size={24} className="shrink-0" />
                          <span className="font-medium text-sm">Something went wrong. Please try again or use direct contact methods.</span>
                        </motion.div>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </TiltCard>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
