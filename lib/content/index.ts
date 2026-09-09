import { CATEGORIES } from "./categories";
import { PRODUCTS } from "./products";
import type { CategorySlug, Domain, Goal, Product } from "./types";

export * from "./types";
export * from "./disclaimers";
export * from "./display";
export * from "./categories";
export * from "./company";
export * from "./faqs";
export * from "./homepage";
export * from "./products";
export * from "./testimonials";

/* ==========================================================================
   Queries
   ========================================================================== */

export const getProduct = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

export const getProductsByCategory = (category: CategorySlug): Product[] =>
  PRODUCTS.filter((p) => p.category === category);

export const getProductsByDomain = (domain: Domain): Product[] => {
  const slugs = new Set(
    CATEGORIES.filter((c) => c.domain === domain).map((c) => c.slug),
  );
  return PRODUCTS.filter((p) => slugs.has(p.category));
};

export const getProductsByGoal = (goal: Goal): Product[] =>
  PRODUCTS.filter((p) => p.goals.includes(goal));

/** Every product slug — feeds generateStaticParams for /products/[slug]. */
export const ALL_PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);

/* ==========================================================================
   Content integrity checks.

   These run at module load, which means they run during `next build`. A
   content mistake fails the build rather than shipping a page that is missing
   its risk disclosure or points at a category that does not exist.
   ========================================================================== */

function assertContentIntegrity(): void {
  const categorySlugs = new Set(CATEGORIES.map((c) => c.slug));
  const seen = new Set<string>();

  for (const p of PRODUCTS) {
    if (seen.has(p.slug)) {
      throw new Error(`Duplicate product slug: "${p.slug}"`);
    }
    seen.add(p.slug);

    if (!categorySlugs.has(p.category)) {
      throw new Error(
        `Product "${p.slug}" references unknown category "${p.category}"`,
      );
    }

    // The central compliance guarantee: no product page can ship without
    // visible risk disclosure (brief §17, §42).
    if (p.risks.length === 0) {
      throw new Error(`Product "${p.slug}" has no risks listed`);
    }

    if (p.disclaimerIds.length === 0) {
      throw new Error(`Product "${p.slug}" has no disclaimers attached`);
    }

    if (p.benefits.length < 3) {
      throw new Error(
        `Product "${p.slug}" needs at least 3 benefits (brief §17), has ${p.benefits.length}`,
      );
    }
  }

  for (const c of CATEGORIES) {
    if (getProductsByCategory(c.slug).length === 0) {
      throw new Error(`Category "${c.slug}" has no products`);
    }
  }
}

assertContentIntegrity();
