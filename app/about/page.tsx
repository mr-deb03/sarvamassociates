import type { Metadata } from "next";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { Partnership } from "@/components/sections/Partnership";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { COMPANY } from "@/lib/content/company";
import { PILLARS, SARVAM_METRICS } from "@/lib/content/homepage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Sarvam Associates",
  description:
    "A Bhandup West practice that has handled tax and compliance for 15+ years, and now advises the same clients on how they invest.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      <PageHero
        eyebrow="About us"
        title={
          <>
            We started with tax returns.{" "}
            <span className="italic">
              The rest followed from the questions.
            </span>
          </>
        }
        lede="Sarvam Associates has been a chartered accountancy practice in Bhandup West for over fifteen years. The wealth arm exists because our clients kept asking the same thing after filing season."
        crumbs={[{ label: "About" }]}
      />

      {/* The story */}
      <section className="bg-paper section">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.35fr] lg:gap-20">
            <Reveal>
              <SectionHeader eyebrow="Our story" title="How we got here" />
            </Reveal>

            <Reveal tall>
              <div className="text-body space-y-5 text-base leading-relaxed">
                <p>
                  For most of our history, the work was direct tax, GST, audit
                  and compliance. Returns filed, notices answered, books closed.
                  It is unglamorous work and we are good at it.
                </p>
                <p>
                  What changed was a question we kept hearing in March, once the
                  filing was done and the refund was through:{" "}
                  <span className="text-navy font-medium">
                    so what should I actually do with this money?
                  </span>
                </p>
                <p>
                  For years the honest answer was &ldquo;ask someone else&rdquo;
                  — and we watched clients get sold products by people who had
                  never seen their tax return, did not know their liabilities,
                  and had no idea what their business owed in six months. The
                  recommendations were not always wrong. But they were made
                  blind.
                </p>
                <p>
                  So we built the other half. Sarvam Associates is now both the
                  practice that files your return and the distributor that helps
                  you invest — which means the person recommending a product can
                  already see what it does to your tax position, and what you
                  will need liquid next year.
                </p>
                <p className="text-navy font-medium">
                  That is the whole idea. Everything else on this site is
                  detail.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="bg-navy grain relative isolate overflow-hidden section-sm">
        <div className="container-page relative">
          <Reveal preset="stagger">
            <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {SARVAM_METRICS.map((stat) => (
                <RevealItem key={stat.id} as="li">
                  <p className="font-sans text-stat text-paper tnum">
                    <AnimatedCounter
                      value={stat.value ?? 0}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="text-paper/60 mt-2 text-sm">{stat.label}</p>
                </RevealItem>
              ))}
              <RevealItem as="li">
                <p className="font-sans text-stat text-paper">
                  Bhandup
                </p>
                <p className="text-paper/60 mt-2 text-sm">
                  A practice you can walk into, in {COMPANY.address.city}
                </p>
              </RevealItem>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* How we work */}
      <section className="bg-mist section">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow="How we work"
              title="Three commitments"
              lede="These are the things we will hold ourselves to, including the ones that cost us business."
            />
          </Reveal>

          <Reveal preset="stagger" className="mt-12" tall>
            <ol className="grid gap-4 lg:grid-cols-3">
              {PILLARS.map((pillar) => (
                <RevealItem
                  key={pillar.index}
                  as="li"
                  className="border-line rounded-card border bg-card p-7"
                >
                  <span
                    aria-hidden
                    className="font-sans text-paper/35 block text-sm tabular-nums"
                  >
                    {String(pillar.index).padStart(2, "0")}
                  </span>
                  <h3 className="text-navy border-line mt-3 border-t pt-4 text-base font-semibold">
                    {pillar.title}
                  </h3>
                  <p className="text-body mt-2 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </RevealItem>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <Partnership />

      <CtaSection
        eyebrow="Come and talk"
        title="The first conversation is free, and genuinely so."
        body="No pitch deck, no product recommendation on the first call. Just a conversation about what you're trying to do with your money."
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />
    </>
  );
}
