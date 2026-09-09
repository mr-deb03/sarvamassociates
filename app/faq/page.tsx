import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { FaqList } from "@/components/ui/Faq";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PRODUCTS } from "@/lib/content/products";
import { GENERAL_FAQS } from "@/lib/content/faqs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "How Sarvam Associates is paid, what we can and cannot promise, what Nuvama's role is, and what happens on the first call.",
  path: "/faq",
});

export default function FaqPage() {
  // Product FAQs, grouped by the product they belong to.
  const productFaqs = PRODUCTS.filter((p) => p.faqs && p.faqs.length > 0);
  const allFaqs = [
    ...GENERAL_FAQS,
    ...productFaqs.flatMap((p) => p.faqs ?? []),
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />
      <FaqJsonLd faqs={allFaqs} />

      <PageHero
        eyebrow="Questions"
        title={
          <>
            The questions worth{" "}
            <span className="italic">asking first.</span>
          </>
        }
        lede="Including the two most firms in this business would rather you didn't ask: how we're paid, and what we can't promise."
        crumbs={[{ label: "FAQ" }]}
      />

      <section className="bg-ivory section">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.45fr] lg:gap-20">
            <Reveal>
              <SectionHeader eyebrow="General" title="About working with us" />
            </Reveal>
            <Reveal tall>
              <FaqList faqs={GENERAL_FAQS} />
            </Reveal>
          </div>
        </div>
      </section>

      {productFaqs.length > 0 && (
        <section className="bg-sand section">
          <div className="container-page">
            <Reveal>
              <SectionHeader
                eyebrow="By product"
                title="Product-specific questions"
              />
            </Reveal>

            <div className="mt-12 space-y-12">
              {productFaqs.map((product) => (
                <Reveal key={product.slug} tall>
                  <div className="grid gap-6 lg:grid-cols-[0.75fr_1.45fr] lg:gap-20">
                    <h3 className="font-display text-charcoal text-xl font-semibold">
                      {product.name}
                    </h3>
                    <FaqList faqs={product.faqs ?? []} />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14">
              <Disclaimer
                ids={[
                  "mf-market-risk",
                  "securities-market-risk",
                  "past-performance",
                  "distributor-role",
                  "not-investment-advice",
                ]}
                variant="panel"
              />
            </Reveal>
          </div>
        </section>
      )}

      <CtaSection
        eyebrow="Still unsure?"
        title="Ask us the one that isn't here."
        body="If something is holding you back that we haven't addressed, put it in the message box. We'd rather answer it before you commit to anything."
      />
    </>
  );
}
