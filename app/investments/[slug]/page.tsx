import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { CATEGORIES, getCategory } from "@/lib/content/categories";
import { getProductsByCategory } from "@/lib/content";
import type { DisclaimerId } from "@/lib/content/disclaimers";
import { buildMetadata } from "@/lib/seo";

/** Only the six investment-domain categories route here. */
export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.domain === "investment").map((c) => ({
    slug: c.slug,
  }));
}

/** An unknown slug 404s at build time rather than attempting a runtime render. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/investments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return buildMetadata({
    ...category.seo,
    path: `/investments/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: PageProps<"/investments/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category || category.domain !== "investment") notFound();

  const products = getProductsByCategory(category.slug);

  // Union of every disclaimer any product in this category carries, so the
  // category page never states less than its own products do.
  const disclaimerIds = [
    ...new Set(products.flatMap((p) => p.disclaimerIds)),
  ] as DisclaimerId[];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Investments", path: "/investments" },
          { name: category.name, path: `/investments/${category.slug}` },
        ]}
      />

      <PageHero
        eyebrow={`Section ${String(category.index).padStart(2, "0")}`}
        title={category.name}
        lede={category.description}
        crumbs={[
          { label: "Investments", href: "/investments" },
          { label: category.shortName },
        ]}
      >
        <ButtonLink href="/contact" withArrow>
          Talk to an advisor
        </ButtonLink>
      </PageHero>

      <section className="bg-ivory section-sm">
        <div className="container-page">
          <Reveal preset="stagger" tall>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <RevealItem key={product.slug} as="li">
                  <ProductCard product={product} />
                </RevealItem>
              ))}
            </ul>
          </Reveal>

          <Disclaimer
            ids={disclaimerIds}
            variant="panel"
            className="mt-12"
          />
        </div>
      </section>

      <OtherCategories currentSlug={category.slug} />

      <CtaSection
        eyebrow="Next step"
        title={`Is ${category.shortName.toLowerCase()} right for you?`}
        body="The honest answer depends on your horizon, your tax position and what you already hold. That is a fifteen-minute conversation, not a web page."
        secondary={{ label: "All solutions", href: "/investments" }}
      />
    </>
  );
}

function OtherCategories({ currentSlug }: { currentSlug: string }) {
  const others = CATEGORIES.filter(
    (c) => c.slug !== currentSlug && c.domain === "investment",
  );

  return (
    <section className="bg-sand border-line border-t section-sm">
      <div className="container-page">
        <h2 className="text-muted mb-6 text-xs font-medium tracking-[0.14em] uppercase">
          Other categories
        </h2>
        <ul className="flex flex-wrap gap-2.5">
          {others.map((c) => (
            <li key={c.slug}>
              <ButtonLink
                href={`/investments/${c.slug}`}
                variant="secondary"
                size="sm"
              >
                {c.name}
              </ButtonLink>
            </li>
          ))}
          <li>
            <ButtonLink href="/financial-solutions" variant="secondary" size="sm">
              Smart Liquidity
            </ButtonLink>
          </li>
        </ul>
      </div>
    </section>
  );
}
