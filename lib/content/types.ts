import type { DisclaimerId } from "./disclaimers";

/* ==========================================================================
   Scales — arrays, not objects, so canonical ORDER is intrinsic to the type.
   Never derive these from Object.keys(); ordering drives the risk meter.
   ========================================================================== */

export const RISK_BANDS = [
  "low",
  "moderately-low",
  "moderate",
  "moderately-high",
  "high",
  "very-high",
] as const;
export type RiskBand = (typeof RISK_BANDS)[number];

export const LIQUIDITY_TIERS = [
  "high",
  "moderate",
  "low",
  "locked-in",
] as const;
export type Liquidity = (typeof LIQUIDITY_TIERS)[number];

/** Powers the §43 "I want to…" product finder. A UX filter, not advice. */
export const GOALS = [
  "grow-wealth",
  "generate-income",
  "protect-wealth",
  "access-liquidity",
  "plan-retirement",
  "reduce-tax",
] as const;
export type Goal = (typeof GOALS)[number];

/* ==========================================================================
   Categories
   ========================================================================== */

export const CATEGORY_SLUGS = [
  "goal-based-investing",
  "wealth-creation",
  "pms",
  "aif",
  "stable-income",
  "wealth-protection",
  "smart-liquidity",
] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/**
 * Which route a category lives under.
 *  - "investment"        -> /investments/[slug]
 *  - "financial-solution"-> /financial-solutions  (liquidity / lending, brief §21)
 */
export type Domain = "investment" | "financial-solution";

export interface Category {
  slug: CategorySlug;
  domain: Domain;
  /** Section number as shown in the source catalogue. */
  index: number;
  name: string;
  /** Short label for nav and cards where the full name is too long. */
  shortName: string;
  tagline: string;
  description: string;
  /** lucide-react icon name; resolved through a map so this stays serialisable. */
  icon: string;
  goals: Goal[];
  seo: Seo;
}

/* ==========================================================================
   Products
   ========================================================================== */

export interface MinInvestment {
  /** Rupees, as a machine value. Never format at rest. */
  amount: number;
  cadence: "one-time" | "monthly";
  /** Present only where the source gives a figure. */
  label?: string;
}

export interface KeyDetail {
  label: string;
  value: string;
  /** Marks a figure the source itself qualifies as indicative, not promised. */
  indicative?: boolean;
}

export interface Product {
  slug: string;
  category: CategorySlug;
  /** Uppercase chip on the card — "SIP", "CAT II AIF", "LAS — EQUITY". */
  badge: string;
  name: string;
  /** One line for cards and search results. */
  summary: string;
  /** "Product Overview" — plain-language paragraphs. */
  overview: string[];

  minInvestment: MinInvestment | null;
  risk: RiskBand;
  liquidity: Liquidity;
  goals: Goal[];

  /** "Why consider it" — 3 to 6 items. */
  benefits: string[];
  /** "Who is this for" — persona cards. */
  audience: string[];
  /**
   * "Risks & Considerations". Required and non-empty by construction — see the
   * assertion in ./index.ts. No product page can ship without visible risk
   * disclosure (brief §17, §42).
   */
  risks: [string, ...string[]];

  /** Key-details table. Only fields actually present in the source. */
  details?: KeyDetail[];
  /** Steps shown in the "How it works" flow, where the source describes one. */
  howItWorks?: { title: string; description: string }[];

  disclaimerIds: readonly DisclaimerId[];
  faqs?: Faq[];
  seo: Seo;
}

/* ==========================================================================
   Supporting content
   ========================================================================== */

export interface Seo {
  title: string;
  description: string;
}

export interface Faq {
  question: string;
  /** Plain text — feeds both the DOM and FAQPage JSON-LD, so no markup. */
  answer: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  /** "Business Owner, Bhandup" — role and locality only, never client PII. */
  context: string;
  /**
   * TRUE for every entry currently in the file. The source document heads
   * these "Dummy Reviews". Nothing on the page may present a placeholder as a
   * verified client statement. Flip to false only when a real, attributable
   * quote replaces the text.
   */
  placeholder: boolean;
}

export interface Stat {
  id: string;
  /** Numeric so AnimatedCounter can drive it; null when the value is a range. */
  value: number | null;
  /** Used verbatim when `value` is null (e.g. "8.5–12%"). */
  displayOverride?: string;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Whose figure this is. Rendered on the card — never left implicit. */
  attribution?: string;
  /** Blocks count-up animation. Animating a return figure implies achievement. */
  noAnimate?: boolean;
  /** Renders an "INDICATIVE" chip. */
  indicative?: boolean;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface Pillar {
  index: number;
  title: string;
  description: string;
}

/** A CA service. Links out to the existing sarvamassociates.com site. */
export interface Service {
  name: string;
  description: string;
  href: string;
  icon: string;
  /** True when `href` leaves this site — drives rel/target and the link icon. */
  external: boolean;
}
