import type { Pillar, ProcessStep, Service, Stat } from "./types";
import { COMPANY } from "./company";

/* ==========================================================================
   Homepage copy.

   Copy here follows the August 2026 revision document, which rewrote the hero,
   the three pillars and the four process steps against the original mockup.
   Where a rewritten line could not ship as written, the correction is applied
   and the original preserved in a comment directly above it.
   ========================================================================== */

export const HERO = {
  // Positioning rather than the company name — the wordmark already sits
  // directly above this in the header, so repeating it wastes the line.
  eyebrow: "Tax · Wealth · Protection · Mumbai",

  // SOURCE CORRECTION — headline.
  // Original (mockup, left untouched by the revision document):
  //   "Ab FD se zyada kamao — without the risk"
  // "without the risk" is an absolute risk-free claim. It is contradicted by
  // every disclaimer on the same page and is exactly the wording brief §42
  // prohibits. The revision document annotated the sub-copy beneath this line
  // but never this line, so it reads as unreviewed rather than deliberate.
  // "without the guesswork" keeps the Hinglish cadence and the em-dash break
  // while dropping the unsupportable claim. Reverting is a one-line change.
  headlineLead: "Ab FD se zyada kamao",
  headlineTail: "without the guesswork",

  // Verbatim from the revision document.
  subhead:
    "15+ years of helping individuals manage their money — now Sarvam Associates brings you premium investment solutions built for those who want better returns than a fixed deposit offers.",

  // Revision document: replaces the original "IN PARTNERSHIP WITH" line.
  trustLine: "Trusted by 500+ investors across Mumbai",

  primaryCta: { label: "Book a Consultation", href: "/contact" },
  secondaryCta: { label: "Explore Solutions", href: "/investments" },
} as const;

/* --------------------------------------------------------------------------
   Trust strip.

   The mockup's fourth chip, "Nuvama Authorised Distribution Partner", was
   marked for deletion by the revision document. It is retained here because
   the user's decision was to keep the Nuvama relationship and present it
   accurately — but it names Sarvam's role as distributor, never as manufacturer.

   The mockup's "SEBI Registered Investment Advisor" chip is NOT retained.
   Sarvam operates as an AMFI-registered distributor; see REGISTRATIONS in
   ./company.ts for why the two cannot both be claimed.
   -------------------------------------------------------------------------- */

export const TRUST_CHIPS: { icon: string; strong: string; rest: string }[] = [
  {
    icon: "Award",
    strong: "15+ years",
    rest: "of tax, compliance and financial advisory",
  },
  {
    icon: "Users",
    strong: "500+ investors",
    rest: "across Mumbai",
  },
  {
    icon: "MapPin",
    strong: "Bhandup (West)",
    rest: "— a practice you can walk into",
  },
  {
    icon: "ShieldCheck",
    strong: "Authorised distribution partner",
    rest: "of Nuvama Wealth Management Ltd",
  },
];

/* --------------------------------------------------------------------------
   Problem / positioning (brief §12)
   -------------------------------------------------------------------------- */

export const PROBLEM = {
  eyebrow: "The bigger picture",
  heading: "Financial decisions rarely exist in isolation.",
  body: "Tax affects what you keep. What you keep decides what you can invest. Investments decide your liquidity. Liquidity decides whether protection ever gets bought. And for a business owner, every one of those reaches back into the company. Most people get each piece from a different person, and nobody sees the whole.",
  chain: [
    { label: "Tax", note: "What you actually keep" },
    { label: "Investments", note: "What that capital becomes" },
    { label: "Liquidity", note: "What you can reach when you need it" },
    { label: "Protection", note: "What survives a bad year" },
    { label: "Wealth", note: "What compounds over a decade" },
  ],
  close: "Sarvam Associates connects these pieces.",
} as const;

/* --------------------------------------------------------------------------
   Why Sarvam — three pillars, verbatim from the revision document
   -------------------------------------------------------------------------- */

export const WHY_INTRO = {
  eyebrow: "Why Sarvam",
  heading: "Your neighbourhood CA, now your wealth partner",
  // Verbatim from the revision document.
  body: "Sarvam Associates has been your trusted financial partner for taxes and compliance. Now, we bring you premium investment products built for serious wealth creation — with the personal guidance you already trust us for.",
} as const;

export const PILLARS: Pillar[] = [
  {
    index: 1,
    title: "One financial picture",
    // Verbatim from the revision document.
    description:
      "From ITR filing to SIP investing to PMS — one advisor who actually knows your full financial picture, not just one piece of it.",
  },
  {
    index: 2,
    title: "Institutional-grade access",
    // Verbatim from the revision document.
    description:
      "Institutional-grade investment products — available to you with the personal touch of a boutique advisor.",
  },
  {
    index: 3,
    title: "Advice you can audit",
    // SOURCE CORRECTION.
    // Revision document wording:
    //   "No commissions driving our advice. No products pushed just to hit a
    //    target. Just recommendations that actually serve you."
    // The first sentence is incompatible with the AMFI-distributor model the
    // user confirmed: distribution revenue IS trail commission. Claiming
    // otherwise while earning it is a live mis-selling exposure. The rewrite
    // keeps the intent — no target-driven selling — and replaces the false
    // claim with a disclosure commitment, which is both true and stronger.
    description:
      "No product pushed to hit a target. We tell you how we're paid, and we recommend what actually fits your goals — including when that means recommending nothing at all.",
  },
];

/** The pull-quote in the "why" panel. Alternative hook from the revision doc. */
export const WHY_QUOTE = {
  quote:
    "Safe money isn't the same as smart money. The right wealth strategy changes everything.",
  attribution: "Sarvam Associates",
} as const;

/* --------------------------------------------------------------------------
   Process — four steps, verbatim from the revision document
   -------------------------------------------------------------------------- */

export const PROCESS: ProcessStep[] = [
  {
    step: 1,
    title: "Free Consultation",
    description:
      "A 15-minute call with our wealth advisor where we get to know your goals, timeline, and what you're already invested in.",
    icon: "MessageSquare",
  },
  {
    step: 2,
    title: "Personalised Plan",
    description:
      "We build a wealth strategy tailored to you using the right products for your profile.",
    icon: "PenLine",
  },
  {
    step: 3,
    title: "Seamless Onboarding",
    description:
      "We handle all the paperwork. Digital KYC, account setup — you're investing within days.",
    icon: "FileCheck",
  },
  {
    step: 4,
    title: "Ongoing Review",
    description:
      "Quarterly check-ins, annual rebalancing, and a direct line to your advisor whenever markets get interesting.",
    icon: "RefreshCw",
  },
];

/* --------------------------------------------------------------------------
   The Numbers (brief §19)

   Cards 1 and 2 are NUVAMA PLATFORM figures, not Sarvam's own. They carry an
   explicit attribution line on the card — presenting a partner's AUM as your
   own is the single most common misrepresentation in this category.

   Card 3 is an indicative range and never count-up animates: animating a
   return figure implies it is being achieved.

   The mockup's "₹1Cr+ Assets Guided" hero card is deliberately absent. It is
   internally inconsistent (₹1 Cr across "500+ investors" is ~₹20k each) and
   sits beside a ₹1L Cr+ figure on the same page. Unverifiable and
   self-undermining, so it is dropped rather than displayed.
   -------------------------------------------------------------------------- */

export const NUMBERS: Stat[] = [
  {
    id: "aum-access",
    value: 1,
    prefix: "₹",
    suffix: "L Cr+",
    label: "AUM you get access to",
    attribution: "Nuvama Wealth platform",
  },
  {
    id: "investors",
    value: 1,
    suffix: "M+",
    label: "Investors across our platform network",
    attribution: "Nuvama Wealth platform",
  },
  {
    id: "mld-range",
    value: null,
    displayOverride: "8.5–12%",
    label: "Indicative returns on MLD offerings",
    indicative: true,
    noAnimate: true,
  },
  {
    id: "capital-protection",
    value: 100,
    suffix: "%",
    label: "Base capital protection on select offerings",
    attribution: "Select structures only, subject to issuer credit",
  },
];

/** Sarvam's own metrics — distinct from the platform figures above. */
export const SARVAM_METRICS: Stat[] = [
  {
    id: "years",
    value: COMPANY.foundedYearsAgo,
    suffix: "+",
    label: "Years of financial advisory",
  },
  {
    id: "clients",
    value: 500,
    suffix: "+",
    label: "Investors across Mumbai",
  },
];

/* --------------------------------------------------------------------------
   CA services.

   These link out to the existing practice site. No stub routes are created for
   them — the source material provides service names and URLs but no page
   content, and brief §7 forbids empty routes.
   -------------------------------------------------------------------------- */

export const SERVICES: Service[] = [
  {
    name: "Direct Tax Consulting",
    description:
      "Income tax planning, return filing, assessments and representation for individuals and businesses.",
    href: `${COMPANY.legacySite}/service/direct-tax-consulting`,
    icon: "Receipt",
    external: true,
  },
  {
    name: "GST & Indirect Taxation",
    description:
      "Registration, monthly and annual returns, reconciliation and advisory on indirect tax.",
    href: `${COMPANY.legacySite}/service/indirect-taxation`,
    icon: "FileSpreadsheet",
    external: true,
  },
  {
    name: "Audit & Assurance",
    description:
      "Statutory, internal and tax audit for businesses and professional practices.",
    href: `${COMPANY.legacySite}/service/audit-assurance`,
    icon: "ClipboardCheck",
    external: true,
  },
  {
    name: "Insurance Solutions",
    description:
      "Life, health and business protection, advised alongside the wealth plan rather than separately.",
    href: `${COMPANY.legacySite}/service/insurance-solutions`,
    icon: "Umbrella",
    external: true,
  },
];

/* --------------------------------------------------------------------------
   FD vs Debt vs Bonds comparison (brief §22)

   Figures from _source/investment-products.html, which is the only internally
   consistent source for them. The mockup's other comparison widget
   ("FD 7–9% vs Equity 12–18% potential") is NOT reproduced: its FD figure
   contradicts the table below, and the equity figure has no source at all.
   -------------------------------------------------------------------------- */

export const COMPARISON = {
  eyebrow: "Where your money can sit",
  heading: "Same rupee. Different job.",
  intro:
    "There is no best option here — only a best fit for a given horizon and a given tolerance for risk. The figures below are indicative, not offers.",
  columns: [
    {
      name: "Bank FD",
      yield: "6.5–7.5%",
      risk: "Low",
      liquidity: "Locked, penalty on premature exit",
      tax: "Taxed as income at slab rate",
      purpose: "Certainty over return",
      highlight: false,
    },
    {
      name: "Debt Funds",
      yield: "7–9%",
      risk: "Moderately low — credit and rate risk",
      liquidity: "Redeem in 1–2 business days",
      tax: "Per prevailing rules for the fund type",
      purpose: "Stability with access",
      highlight: true,
    },
    {
      name: "Bonds",
      yield: "8–11%",
      risk: "Moderate — credit risk on the issuer",
      liquidity: "Low — thin secondary market",
      tax: "Coupon taxed as income",
      purpose: "Contracted income on known dates",
      highlight: false,
    },
  ],
} as const;
