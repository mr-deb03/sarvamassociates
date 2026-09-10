import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCategory } from "@/lib/content/categories";
import { getProductsByDomain } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Financial Solutions — Loan Against Securities",
  description:
    "Unlock liquidity from your portfolio without selling. Loans against mutual funds, shares, PMS and bonds — with the margin-call risk stated plainly.",
  path: "/financial-solutions",
});

/** The mechanism, explained once. Same shape as the product how-it-works flow. */
const MECHANISM = [
  {
    title: "You pledge, you don't sell",
    body: "Your units or shares are marked as collateral with the lender. They stay in your name, stay invested, and keep participating in the market.",
  },
  {
    title: "A limit is sanctioned against them",
    body: "The lender assigns a loan-to-value against the eligible portion of your holdings. Typically up to 80% for mutual funds, lower for individual shares.",
  },
  {
    title: "You draw only what you need",
    body: "It behaves like an overdraft rather than a term loan. Interest accrues on the amount actually drawn, not on the sanctioned limit.",
  },
  {
    title: "You repay and the pledge lifts",
    body: "Repay from cash flow as it arrives. Once the outstanding is cleared, the pledge is released and the holdings are freely yours again.",
  },
];

export default function FinancialSolutionsPage() {
  const category = getCategory("smart-liquidity");
  const products = getProductsByDomain("financial-solution");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Financial Solutions", path: "/financial-solutions" },
        ]}
      />

      <PageHero
        eyebrow="Financial solutions"
        title={
          <>
            Need cash?{" "}
            <span className="italic">Don&rsquo;t sell your investments.</span>
          </>
        }
        lede={category?.description}
        crumbs={[{ label: "Financial Solutions" }]}
      >
        <ButtonLink href="/contact" size="lg" withArrow>
          Check your eligibility
        </ButtonLink>
      </PageHero>

      {/* Why this exists */}
      <section className="bg-paper section">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
            <Reveal>
              <SectionHeader
                eyebrow="The problem"
                title="Selling costs more than it looks like it does"
              />
            </Reveal>

            <Reveal tall>
              <div className="text-body space-y-5 text-base leading-relaxed">
                <p>
                  When a short-term need arrives — a working-capital gap, an
                  advance tax payment, a bridging requirement — the obvious move
                  is to redeem an investment. It is also usually the expensive
                  one.
                </p>
                <p>
                  Selling crystallises capital gains tax on a position you
                  intended to hold. It takes you out of the market, often at
                  precisely the wrong moment. And once a long-term compounding
                  position is broken, most people never rebuild it.
                </p>
                <p className="text-navy font-medium">
                  Borrowing against the portfolio avoids both. But it introduces
                  a risk that selling does not have — and that risk is set out
                  below, not buried.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy grain relative isolate overflow-hidden section">
        <div className="container-page relative">
          <Reveal>
            <SectionHeader
              onDark
              eyebrow="The mechanism"
              title="How lending against a portfolio works"
            />
          </Reveal>

          <Reveal preset="stagger" className="mt-14" tall>
            <ol className="grid gap-8 lg:grid-cols-4">
              {MECHANISM.map((step, i) => (
                <RevealItem key={step.title} as="li">
                  <span
                    aria-hidden
                    className="font-sans text-paper/35 block text-sm tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-paper border-paper/20 mt-3 border-t pt-4 text-base font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-paper/50 mt-2 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </RevealItem>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* The margin call — deliberately its own section, not a footnote */}
      <section className="bg-paper section-sm">
        <div className="container-page">
          <Reveal>
            <div className="border-error/30 bg-error/[0.05] rounded-card border p-8 lg:p-10">
              <h2 className="font-display text-navy flex items-center gap-3 text-2xl font-semibold">
                <AlertTriangle
                  aria-hidden
                  className="text-error size-6 shrink-0"
                />
                The one thing to understand before you borrow
              </h2>

              <div className="text-body mt-5 max-w-3xl space-y-4 text-sm leading-relaxed">
                <p>
                  Your investments are pledged. If their value falls far enough
                  relative to what you have drawn, the lender can issue a{" "}
                  <strong className="text-navy font-semibold">margin call</strong>{" "}
                  — a demand that you pledge more collateral or repay part of the
                  loan, usually at short notice.
                </p>
                <p>
                  If you cannot meet it, the lender may sell your pledged
                  holdings to recover what it is owed. That sale happens at
                  whatever the market price is on that day, which is not likely
                  to be a good one.
                </p>
                <p className="text-navy font-medium">
                  Market falls and cash-flow pressure tend to arrive together.
                  That correlation is the real risk of this product, and it is
                  why we will ask how you plan to repay before we discuss how
                  much you can borrow.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Products */}
      <section className="bg-mist section">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow="Solutions"
              title="Three ways to borrow against what you hold"
              lede="Which one applies depends on what your portfolio is made of. Mutual fund units are the simplest and cheapest to pledge; PMS and bonds take longer to assess."
            />
          </Reveal>

          <Reveal preset="stagger" className="mt-12" tall>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <RevealItem key={product.slug} as="li">
                  <ProductCard product={product} />
                </RevealItem>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-12">
            <Disclaimer
              ids={[
                "las-collateral",
                "indicative-yield",
                "securities-market-risk",
                "distributor-role",
              ]}
              variant="panel"
            />
          </Reveal>
        </div>
      </section>

      {/* Honest counter-case */}
      <section className="bg-paper section-sm">
        <div className="container-page">
          <Reveal>
            <div className="border-line mx-auto max-w-3xl rounded-card border bg-card p-8 text-center lg:p-10">
              <h2 className="font-display text-navy text-2xl font-semibold">
                When we&rsquo;ll tell you to just sell
              </h2>
              <p className="text-body mx-auto mt-4 max-w-2xl text-sm leading-relaxed">
                If the need is long-term rather than a bridge, if the interest
                rate is likely to exceed what the portfolio returns over the
                period, or if the holding was one you were going to exit anyway
                — borrowing against it is the worse answer. We would rather say
                so on the first call than arrange a loan you did not need.
              </p>
              <ButtonLink
                href="/contact"
                variant="secondary"
                className="mt-7"
                withArrow
              >
                Ask us which applies to you
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaSection
        eyebrow="Next step"
        title="Find out what you could borrow"
        body="We will look at what you hold, what is eligible for pledge, and — first — whether borrowing is actually the right answer for what you need the money for."
        secondary={{ label: "See investment solutions", href: "/investments" }}
      />
    </>
  );
}
