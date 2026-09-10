import Link from "next/link";
import { Comparison } from "@/components/sections/Comparison";
import { CtaSection } from "@/components/sections/CtaSection";
import { Hero } from "@/components/sections/Hero";
import { Numbers } from "@/components/sections/Numbers";
import { Partnership } from "@/components/sections/Partnership";
import { Problem } from "@/components/sections/Problem";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhySarvam } from "@/components/sections/WhySarvam";
import { FaqJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { FaqList } from "@/components/ui/Faq";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GENERAL_FAQS } from "@/lib/content/faqs";

/** The six questions most likely to block a first conversation. */
const HOME_FAQS = GENERAL_FAQS.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <WebSiteJsonLd />
      {/* Only FAQs actually rendered below are emitted as structured data. */}
      <FaqJsonLd faqs={HOME_FAQS} />

      {/* The §46 narrative: problem -> partner -> solutions -> proof -> ask */}
      <Hero />
      <TrustStrip />
      <Problem />
      <WhySarvam />
      <ServicesSection />
      <SolutionsSection />
      <Partnership />
      <Numbers />
      <ProcessTimeline />
      <Comparison />
      <Testimonials allowPlaceholders />

      {/* Paper, not mist — Testimonials directly above is already mist, and two
          mist sections in a row erase the light/tinted alternation. */}
      <section className="section">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr] lg:gap-20">
            <Reveal>
              <SectionHeader
                eyebrow="Questions"
                title="The things people ask first"
                lede="Including the two most advisors avoid: how we're paid, and what we can't promise."
              />
              <Link
                href="/faq"
                className="link-underline text-accent-ink mt-6 inline-block text-sm font-medium"
              >
                Read all questions
              </Link>
            </Reveal>

            <Reveal tall>
              <FaqList faqs={HOME_FAQS} />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection secondary={{ label: "Explore solutions", href: "/investments" }} />
    </>
  );
}
