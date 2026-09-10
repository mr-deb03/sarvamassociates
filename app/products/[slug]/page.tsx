import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, UserRound } from "lucide-react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ProductJsonLd,
} from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Disclaimer, RisksBlock } from "@/components/ui/Disclaimer";
import { FaqList } from "@/components/ui/Faq";
import { RiskMeter } from "@/components/ui/RiskMeter";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategory } from "@/lib/content/categories";
import { ALL_PRODUCT_SLUGS, getProduct, getProductsByCategory } from "@/lib/content";
import { formatMinimum, LIQUIDITY_LABELS } from "@/lib/content/display";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return ALL_PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return buildMetadata({ ...product.seo, path: `/products/${slug}` });
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  if (!category) notFound();

  const isLiquidity = category.domain === "financial-solution";
  const categoryHref = isLiquidity
    ? "/financial-solutions"
    : `/investments/${category.slug}`;

  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          {
            name: isLiquidity ? "Financial Solutions" : "Investments",
            path: isLiquidity ? "/financial-solutions" : "/investments",
          },
          { name: category.shortName, path: categoryHref },
          { name: product.name, path: `/products/${product.slug}` },
        ]}
      />
      {product.faqs && <FaqJsonLd faqs={product.faqs} />}

      {/* ---------- Hero ---------- */}
      <PageHero
        eyebrow={category.name}
        title={product.name}
        lede={product.summary}
        crumbs={[
          {
            label: isLiquidity ? "Financial Solutions" : "Investments",
            href: isLiquidity ? "/financial-solutions" : "/investments",
          },
          { label: category.shortName, href: categoryHref },
          { label: product.name },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href="/contact" size="lg" withArrow>
            Discuss this product
          </ButtonLink>
          <ButtonLink href="/contact" variant="tertiary" size="lg" withArrow>
            Talk to an advisor
          </ButtonLink>
        </div>

        {/* At-a-glance. Risk sits beside the minimum, never below it — the
            two facts a reader needs in the same glance. */}
        <dl className="border-line mt-14 grid gap-8 border-t pt-10 sm:grid-cols-3">
          <div>
            <dt className="text-eyebrow text-muted uppercase">Minimum</dt>
            <dd className="font-sans text-stat-sm text-navy tnum mt-3">
              {formatMinimum(product.minInvestment)}
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow text-muted uppercase">Risk</dt>
            <dd className="mt-5">
              <RiskMeter risk={product.risk} />
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow text-muted uppercase">Liquidity</dt>
            <dd className="text-body mt-4 text-sm">
              {LIQUIDITY_LABELS[product.liquidity]}
            </dd>
          </div>
        </dl>
      </PageHero>

      {/* ---------- Overview ---------- */}
      <section className="bg-paper section">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
            <Reveal>
              <SectionHeader eyebrow="Overview" title="What this actually is" />
            </Reveal>

            <Reveal tall>
              <div className="space-y-5">
                {product.overview.map((para) => (
                  <p key={para} className="text-body text-base leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Benefits ---------- */}
      <section className="bg-mist section">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow="Why consider it"
              title="What it does well"
            />
          </Reveal>

          <Reveal preset="stagger" className="mt-12" tall>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.benefits.map((benefit) => (
                <RevealItem
                  key={benefit}
                  as="li"
                  className="border-line flex gap-3.5 rounded-card border bg-card p-6"
                >
                  <span
                    aria-hidden
                    className="bg-positive/10 text-positive mt-0.5 grid size-6 shrink-0 place-items-center rounded-full"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-body text-sm leading-relaxed">
                    {benefit}
                  </span>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      {product.howItWorks && (
        <section className="bg-navy grain relative isolate overflow-hidden section">
          <div className="container-page relative">
            <Reveal>
              <SectionHeader
                onDark
                eyebrow="How it works"
                title="Four steps, start to review"
              />
            </Reveal>

            <Reveal preset="stagger" className="mt-14" tall>
              <ol className="grid gap-8 lg:grid-cols-4">
                {product.howItWorks.map((step, i) => (
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
                      {step.description}
                    </p>
                  </RevealItem>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Key details ---------- */}
      {product.details && product.details.length > 0 && (
        <section className="bg-paper section">
          <div className="container-page">
            <Reveal>
              <SectionHeader eyebrow="Key details" title="The specifics" />
            </Reveal>

            <Reveal className="mt-10">
              <div className="border-line overflow-hidden rounded-card border bg-card">
                <dl className="divide-line divide-y">
                  {product.details.map((detail) => (
                    <div
                      key={detail.label}
                      className="grid gap-1 px-6 py-5 sm:grid-cols-[16rem_1fr] sm:gap-6"
                    >
                      <dt className="text-muted text-xs font-medium tracking-[0.08em] uppercase sm:pt-0.5">
                        {detail.label}
                      </dt>
                      <dd className="text-navy flex flex-wrap items-center gap-2.5 text-sm">
                        <span className="font-medium">{detail.value}</span>
                        {detail.indicative && (
                          <Chip tone="indicative">Indicative</Chip>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Audience ---------- */}
      <section className="bg-mist section">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow="Who is this for"
              title="You might be a fit if…"
              lede="If none of these describe you, that is useful information too — tell us on the call and we will point you somewhere more suitable."
            />
          </Reveal>

          <Reveal preset="stagger" className="mt-12" tall>
            <ul className="grid gap-4 sm:grid-cols-2">
              {product.audience.map((persona) => (
                <RevealItem
                  key={persona}
                  as="li"
                  className="border-line flex items-start gap-4 rounded-card border bg-card p-6"
                >
                  <span
                    aria-hidden
                    className="bg-navy/[0.05] text-navy grid size-9 shrink-0 place-items-center rounded-full"
                  >
                    <UserRound strokeWidth={1.75} className="size-4" />
                  </span>
                  <span className="text-body text-sm leading-relaxed">
                    {persona}
                  </span>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Risks — full width, body size, above the CTA ---------- */}
      <section className="bg-paper section">
        <div className="container-page">
          <Reveal>
            <RisksBlock risks={product.risks} />
          </Reveal>

          <Reveal className="mt-6">
            <Disclaimer ids={product.disclaimerIds} variant="panel" />
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="bg-mist section">
          <div className="container-page">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
              <Reveal>
                <SectionHeader
                  eyebrow="Questions"
                  title={`About ${product.name}`}
                />
              </Reveal>
              <Reveal tall>
                <FaqList faqs={product.faqs} />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="bg-paper border-line border-t section-sm">
          <div className="container-page">
            <h2 className="text-muted mb-8 text-xs font-medium tracking-[0.14em] uppercase">
              Also in {category.name}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaSection
        eyebrow="Next step"
        title="Talk to a Sarvam advisor"
        body={`Fifteen minutes on ${product.name.toLowerCase()} — whether it fits, what it would cost you, and what could go wrong. No obligation either way.`}
        primary={{ label: "Book a consultation", href: "/contact" }}
        secondary={{ label: "Back to solutions", href: categoryHref }}
      />
    </>
  );
}
