import type { Metadata } from "next";
import { ProductFinder } from "@/components/products/ProductFinder";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { getProductsByDomain } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Investment Solutions",
  description:
    "Nineteen investment solutions across seven categories — from a ₹500 monthly SIP to PMS and alternative strategies. Each states plainly who it is for, and its risks.",
  path: "/investments",
});

export default function InvestmentsPage() {
  const products = getProductsByDomain("investment");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Investments", path: "/investments" },
        ]}
      />

      <PageHero
        eyebrow="Investment solutions"
        title={
          <>
            Solutions for every goal —{" "}
            <span className="italic">and every risk appetite</span>
          </>
        }
        lede="From your first ₹500 SIP to portfolio strategies with a ₹50 lakh minimum. Filter by what you're trying to do, how much risk you can live with, and what you can start with."
        crumbs={[{ label: "Investments" }]}
      />

      <section className="bg-paper section-sm">
        <div className="container-page">
          <ProductFinder products={products} />

          <Disclaimer
            ids={[
              "mf-market-risk",
              "securities-market-risk",
              "past-performance",
              "distributor-role",
            ]}
            variant="panel"
            className="mt-12"
          />
        </div>
      </section>

      <CtaSection
        eyebrow="Not sure where to start?"
        title="That's exactly what the first call is for."
        body="Most people arrive here unsure which category applies to them. Fifteen minutes usually settles it — and sometimes the answer is that your current arrangement is already fine."
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />
    </>
  );
}
