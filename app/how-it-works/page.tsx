import type { Metadata } from "next";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  description:
    "From a 15-minute first call to quarterly reviews — how working with Sarvam Associates actually goes, including what we ask for and what we don't.",
  path: "/how-it-works",
});

const EXPECTATIONS = [
  {
    title: "What the first call is",
    body: "Fifteen minutes, usually by phone. We ask what you're trying to do with your money, when you need it, and what you already hold. You do most of the talking.",
  },
  {
    title: "What it isn't",
    body: "Not a pitch. We do not recommend a product on the first call, because we do not yet know enough to recommend one responsibly.",
  },
  {
    title: "What we'll ask for",
    body: "Your goals, rough timelines, and a sense of your existing investments. For onboarding, standard KYC documents — identity and address proof.",
  },
  {
    title: "What we won't ask for",
    body: "Nothing sensitive through this website. No PAN, no Aadhaar, no bank details, no account passwords. KYC happens through regulated channels, never a web form or a WhatsApp message.",
  },
  {
    title: "What happens if you say no",
    body: "Nothing. No follow-up sequence, no mailing list, no monthly check-in. If the timing is wrong, it's wrong.",
  },
  {
    title: "What we'll tell you honestly",
    body: "If your existing arrangement is fine, we'll say so. If a product doesn't fit you, we'll say that too — including when it's one we distribute.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ]}
      />

      <PageHero
        eyebrow="The process"
        title={
          <>
            From conversation to{" "}
            <span className="italic">compounding.</span>
          </>
        }
        lede="Four steps, and no surprises in any of them. Here is exactly what each one involves — including what we will and will not ask you for."
        crumbs={[{ label: "How it works" }]}
      />

      <ProcessTimeline compact />

      <section className="bg-ivory section">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow="Setting expectations"
              title="What to expect, plainly"
              lede="Most financial firms describe their process in terms of what they deliver. This is the version written from your side of the table."
            />
          </Reveal>

          <Reveal preset="stagger" className="mt-12" tall>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EXPECTATIONS.map((item) => (
                <RevealItem
                  key={item.title}
                  as="li"
                  className="border-line rounded-card border bg-ivory p-6"
                >
                  <h3 className="text-charcoal text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-body mt-2 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </RevealItem>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-12">
            <Disclaimer
              ids={["not-investment-advice", "distributor-role", "mf-market-risk"]}
              variant="panel"
            />
          </Reveal>
        </div>
      </section>

      <CtaSection
        eyebrow="Step one"
        title="Book the fifteen minutes."
        body="It costs nothing and commits you to nothing. Worst case, you leave knowing your current arrangement is already sound."
        secondary={{ label: "Browse solutions first", href: "/investments" }}
      />
    </>
  );
}
