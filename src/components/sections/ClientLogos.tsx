"use client";

import Marquee from "react-fast-marquee";
import { FadeIn } from "@/components/animations/FadeIn";
import { 
  siStripe, siVercel, siSupabase, siGoogle, 
  siShopify, siCloudflare, siDigitalocean, siFigma
} from "simple-icons";

// Using recognized tech/startup logos as "partner/client" placeholders
const clients = [
  siStripe,
  siVercel,
  siSupabase,
  siGoogle,
  siShopify,
  siCloudflare,
  siDigitalocean,
  siFigma
];

export function ClientLogos() {
  return (
    <section className="py-24 border-y border-white/5 bg-background overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 mb-12">
        <FadeIn>
          <h3 className="text-center text-sm font-medium tracking-widest text-muted-foreground uppercase">Trusted By Innovative Companies</h3>
        </FadeIn>
      </div>

      <Marquee speed={30} gradient={false} pauseOnHover={true} direction="right">
        <div className="flex gap-20 md:gap-32 items-center pl-20 md:pl-32">
          {clients.map((client) => (
            <div 
              key={client.title} 
              className="flex items-center justify-center group cursor-pointer"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="w-24 h-12 md:w-32 md:h-16 transition-all duration-500 opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                style={{ fill: "currentColor" }}
              >
                <path d={client.path} />
                <style jsx>{`
                  svg:hover {
                    fill: #${client.hex};
                  }
                `}</style>
              </svg>
            </div>
          ))}
        </div>
      </Marquee>
    </section>
  );
}
