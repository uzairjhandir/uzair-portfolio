"use client";

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
import { BlockRenderer } from "@/components/sections/BlockRenderer";
import { usePageRenderQuery } from "@/lib/query/pages/queries";
import { PageBlockRender } from "@/lib/query/pages/types";

/**
 * Page Builder block types with a static-section fallback. If the "home"
 * page has a published block of a given type, it replaces the matching
 * static section; otherwise the static section renders as-is (Phase 9.1:
 * "missing blocks handled gracefully"). Portfolio/Certifications/Articles/
 * WhyChooseMe are already wired to real APIs outside the Page Builder, so
 * they always render statically — there is no corresponding block type.
 */
export function HomeClient() {
  const { data: pageRender } = usePageRenderQuery("home");
  const blocks = pageRender?.blocks || [];

  const findBlock = (type: string): PageBlockRender | undefined =>
    blocks.find((b) => b.type === type);

  const hero = findBlock("hero");
  const clientLogos = findBlock("client-logos");
  const about = findBlock("about");
  const services = findBlock("services");
  const process = findBlock("process");
  const technologies = findBlock("technologies");
  const skills = findBlock("skills");
  const testimonials = findBlock("testimonials");
  const faq = findBlock("faq");
  const contactSection = findBlock("contact-section");

  return (
    <div className="w-full flex flex-col">
      {hero ? <BlockRenderer block={hero} /> : <Hero />}
      {clientLogos ? <BlockRenderer block={clientLogos} /> : <ClientLogos />}
      {about ? <BlockRenderer block={about} /> : <PersonalIntro />}
      <WhyChooseMe />
      {services ? <BlockRenderer block={services} /> : <Services />}
      {process ? <BlockRenderer block={process} /> : <Process />}
      {technologies ? <BlockRenderer block={technologies} /> : <TechStackCarousel />}
      {skills ? <BlockRenderer block={skills} /> : <Skills />}
      <Portfolio />
      {testimonials ? <BlockRenderer block={testimonials} /> : <Testimonials />}
      <Certifications />
      <Articles />
      {faq ? <BlockRenderer block={faq} /> : <FAQ />}
      {contactSection && <BlockRenderer block={contactSection} />}
      <Contact />
    </div>
  );
}
