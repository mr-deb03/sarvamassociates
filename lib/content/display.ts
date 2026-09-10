import type { Goal, Liquidity, MinInvestment, RiskBand } from "./types";
import { RISK_BANDS } from "./types";

/* ==========================================================================
   Presentation maps.

   Products store machine values (`risk: "high"`, `amount: 5000000`). Everything
   user-facing derives from these maps, which is what lets one stored field
   drive both a card and a filter without the two ever drifting apart.
   ========================================================================== */

export interface RiskMeta {
  label: string;
  /** Position on the scale, 1-based. Derived from RISK_BANDS order. */
  level: number;
  /** Text + surface classes, AA-contrast checked on paper. */
  className: string;
  /** Fill colour for the meter pips. */
  pipClassName: string;
}

const RISK_LABELS: Record<RiskBand, string> = {
  low: "Low",
  "moderately-low": "Moderately Low",
  moderate: "Moderate",
  "moderately-high": "Moderately High",
  high: "High",
  "very-high": "Very High",
};

/**
 * The meter runs muted-green → neutral → muted-red across the six bands.
 * Both ends are deliberately restrained: a bright red "very high" would read
 * as alarm rather than as information, and a bright green "low" would read as
 * an endorsement. Neither is what a risk band means.
 */
const RISK_CLASSES: Record<RiskBand, { chip: string; pip: string }> = {
  low: { chip: "bg-positive/10 text-positive", pip: "bg-positive" },
  "moderately-low": { chip: "bg-positive/10 text-positive", pip: "bg-positive" },
  moderate: { chip: "bg-navy/[0.06] text-muted", pip: "bg-muted" },
  "moderately-high": { chip: "bg-error/10 text-error", pip: "bg-error/70" },
  high: { chip: "bg-error/12 text-error", pip: "bg-error/85" },
  "very-high": { chip: "bg-error/15 text-error", pip: "bg-error" },
};

export const RISK_META: Record<RiskBand, RiskMeta> = Object.fromEntries(
  RISK_BANDS.map((band, i) => [
    band,
    {
      label: RISK_LABELS[band],
      level: i + 1,
      className: RISK_CLASSES[band].chip,
      pipClassName: RISK_CLASSES[band].pip,
    },
  ]),
) as Record<RiskBand, RiskMeta>;

/** Total pips on the meter — derived, so adding a band updates every meter. */
export const RISK_SCALE_LENGTH = RISK_BANDS.length;

export const LIQUIDITY_LABELS: Record<Liquidity, string> = {
  high: "High — redeem in days",
  moderate: "Moderate — subject to terms",
  low: "Low — difficult to exit early",
  "locked-in": "Locked in",
};

export const GOAL_LABELS: Record<Goal, string> = {
  "grow-wealth": "Grow my wealth",
  "generate-income": "Generate income",
  "protect-wealth": "Protect what I have",
  "access-liquidity": "Access liquidity",
  "plan-retirement": "Plan for retirement",
  "reduce-tax": "Be more tax-efficient",
};

/* ==========================================================================
   Money formatting — Indian lakh/crore conventions.

   Always renders in the sans face. Playfair's ₹ coverage is unreliable and a
   missing glyph falls back silently mid-word.
   ========================================================================== */

const LAKH = 100_000;
const CRORE = 10_000_000;

/** 5000000 -> "₹50 Lakh" · 10000000 -> "₹1 Crore" · 1000 -> "₹1,000" */
export function formatInr(amount: number): string {
  if (amount >= CRORE) {
    const v = amount / CRORE;
    return `₹${trimZeros(v)} Crore`;
  }
  if (amount >= LAKH) {
    const v = amount / LAKH;
    return `₹${trimZeros(v)} Lakh`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

function trimZeros(v: number): string {
  return v % 1 === 0 ? String(v) : v.toFixed(2).replace(/\.?0+$/, "");
}

/** Card line for a product's minimum, or a fallback when there is none. */
export function formatMinimum(min: MinInvestment | null): string {
  if (!min) return "On enquiry";
  if (min.label) return min.cadence === "monthly" ? min.label : min.label;
  const base = formatInr(min.amount);
  return min.cadence === "monthly" ? `${base}/month` : base;
}

/* ==========================================================================
   Ticket-size tiers — drive the §43 product finder.
   ========================================================================== */

export interface InvestmentTier {
  id: string;
  label: string;
  matches: (min: MinInvestment | null) => boolean;
}

export const INVESTMENT_TIERS: InvestmentTier[] = [
  { id: "any", label: "Any amount", matches: () => true },
  {
    id: "entry",
    label: "Under ₹1 Lakh",
    matches: (m) => m === null || m.amount < LAKH,
  },
  {
    id: "mid",
    label: "₹1 Lakh – ₹50 Lakh",
    matches: (m) => m !== null && m.amount >= LAKH && m.amount < 50 * LAKH,
  },
  {
    id: "hnw",
    label: "₹50 Lakh and above",
    matches: (m) => m !== null && m.amount >= 50 * LAKH,
  },
];
