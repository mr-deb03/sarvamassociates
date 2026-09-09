import type { Metadata } from "next";
import { Info } from "lucide-react";
import { SipCalculator } from "@/components/calculators/SipCalculator";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SIP & Lump-Sum Calculator",
  description:
    "An illustration of how monthly or one-time investments compound at an assumed rate. Arithmetic, not a forecast — real returns vary and can be negative.",
  path: "/calculators",
});

export default function CalculatorsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
        ]}
      />

      <PageHero
        eyebrow="Illustration only"
        title={
          <>
            What compounding{" "}
            <span className="italic">looks like on paper.</span>
          </>
        }
        lede="Move the sliders to see how a monthly or one-time investment grows at a rate you assume. It is useful for understanding the shape of compounding — and misleading if read as a prediction."
        crumbs={[{ label: "Calculators" }]}
      />

      <section className="bg-ivory section-sm">
        <div className="container-page">
          {/* Framing sits ABOVE the tool, not below it */}
          <div className="border-error/30 bg-error/[0.05] mb-8 flex items-start gap-3 rounded-card border p-5">
            <Info strokeWidth={1.75} aria-hidden className="text-error mt-0.5 size-5 shrink-0" />
            <div>
              <h2 className="text-charcoal text-sm font-semibold">
                Read this before you read the number
              </h2>
              <p className="text-body mt-1.5 text-sm leading-relaxed">
                This calculator assumes the same return every single year. No
                real investment does that. A portfolio that averages 12% over a
                decade will have had years at −20% and years at +30%, and the
                order those arrive in changes the outcome. The figure below is
                arithmetic on an assumption you chose — not a projection, not a
                promise, and not advice.
              </p>
            </div>
          </div>

          <SipCalculator />

          <Disclaimer
            ids={[
              "illustration-only",
              "mf-market-risk",
              "past-performance",
              "not-investment-advice",
            ]}
            variant="panel"
            className="mt-8"
          />
        </div>
      </section>

      <CtaSection
        eyebrow="From illustration to plan"
        title="A number on a slider isn't a plan."
        body="What turns it into one is knowing your horizon, your tax position, and what you'd do if the market fell 30% in year three. That's the conversation."
        secondary={{ label: "See solutions", href: "/investments" }}
      />
    </>
  );
}
