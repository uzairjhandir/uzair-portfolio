import { Hero } from "@/components/sections/Hero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { PersonalIntro } from "@/components/sections/PersonalIntro";
import { WhyChooseMe } from "@/components/sections/WhyChooseMe";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Portfolio } from "@/components/sections/Portfolio";
import { TechStackCarousel } from "@/components/sections/TechStackCarousel";
import { Testimonials } from "@/components/sections/Testimonials";
import { Certifications } from "@/components/sections/Certifications";
import { Articles } from "@/components/sections/Articles";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <ClientLogos />
      <PersonalIntro />
      <WhyChooseMe />
      <Services />
      <Process />
      <TechStackCarousel />
      <Skills />
      <Portfolio />
      <Testimonials />
      <Certifications />
      <Articles />
      <FAQ />
      <Contact />
    </div>
  );
}
