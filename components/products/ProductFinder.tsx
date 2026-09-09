"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { GOAL_LABELS, INVESTMENT_TIERS, RISK_META } from "@/lib/content/display";
import { GOALS, RISK_BANDS, type Goal, type Product, type RiskBand } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Product finder (brief §43).
 *
 * IMPORTANT — this is a discovery filter, not a recommendation engine. It
 * narrows a catalogue by attributes the user selects; it does not assess
 * suitability, does not rank, and does not tell anyone what to buy. The copy
 * says so plainly, because an interface that appears to recommend investments
 * is regulated advice.
 *
 * This is one of the few places the client boundary moves up a level: the
 * filter must own the render to reorder and hide cards, so `Product` crosses
 * the boundary as plain serialisable data.
 */
export function ProductFinder({ products }: { products: Product[] }) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [risk, setRisk] = useState<RiskBand | null>(null);
  const [tier, setTier] = useState<string>("any");

  const filtered = useMemo(() => {
    const tierMatcher = INVESTMENT_TIERS.find((t) => t.id === tier);
    return products.filter(
      (p) =>
        (!goal || p.goals.includes(goal)) &&
        (!risk || p.risk === risk) &&
        (!tierMatcher || tierMatcher.matches(p.minInvestment)),
    );
  }, [products, goal, risk, tier]);

  const active = goal !== null || risk !== null || tier !== "any";

  const reset = () => {
    setGoal(null);
    setRisk(null);
    setTier("any");
  };

  return (
    <div>
      <div className="border-line rounded-card border bg-ivory p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-charcoal flex items-center gap-2.5 text-base font-semibold">
            <SlidersHorizontal strokeWidth={1.75} aria-hidden className="text-muted size-4" />
            Narrow it down
          </h2>

          {active && (
            <button
              type="button"
              onClick={reset}
              className="text-muted hover:text-charcoal flex items-center gap-1 text-xs font-medium transition-colors"
            >
              <X strokeWidth={1.75} aria-hidden className="size-3.5" />
              Clear filters
            </button>
          )}
        </div>

        <div className="space-y-6">
          <FilterRow label="I want to…">
            {GOALS.map((g) => (
              <FilterChip
                key={g}
                selected={goal === g}
                onClick={() => setGoal(goal === g ? null : g)}
              >
                {GOAL_LABELS[g]}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Risk I'm comfortable with">
            {RISK_BANDS.map((r) => (
              <FilterChip
                key={r}
                selected={risk === r}
                onClick={() => setRisk(risk === r ? null : r)}
              >
                {RISK_META[r].label}
              </FilterChip>
            ))}
          </FilterRow>

          <FilterRow label="Amount I can start with">
            {INVESTMENT_TIERS.map((t) => (
              <FilterChip
                key={t.id}
                selected={tier === t.id}
                onClick={() => setTier(t.id)}
              >
                {t.label}
              </FilterChip>
            ))}
          </FilterRow>
        </div>

        <p className="border-line text-muted mt-6 border-t pt-5 text-xs leading-relaxed">
          This filter narrows the catalogue by what you select. It does not
          assess whether a product suits your circumstances and it is not a
          recommendation — that conversation needs an advisor who knows your
          full position.
        </p>
      </div>

      <p aria-live="polite" className="text-muted mt-8 text-sm">
        Showing <span className="text-charcoal font-semibold">{filtered.length}</span>{" "}
        of {products.length} solutions
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-line mt-5 rounded-card border border-dashed p-12 text-center">
          <p className="font-display text-charcoal text-xl font-semibold">
            Nothing matches that combination
          </p>
          <p className="text-body mx-auto mt-2 max-w-md text-sm leading-relaxed">
            That usually means the risk level and the starting amount are
            pulling in opposite directions. Try widening one of them — or just
            ask us directly.
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-champagne-ink link-underline mt-5 text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-muted mb-2.5 text-xs font-medium tracking-[0.1em] uppercase">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-input px-3 py-1.5 text-xs font-medium transition-all duration-200",
        selected
          ? "bg-charcoal text-ivory"
          : "border-line text-body hover:border-charcoal/30 hover:text-charcoal border bg-transparent",
      )}
    >
      {children}
    </button>
  );
}
