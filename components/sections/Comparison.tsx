import { Reveal } from "@/components/motion/Reveal";
import { Chip } from "@/components/ui/Chip";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { COMPARISON } from "@/lib/content/homepage";
import { cn } from "@/lib/utils";

const ROWS = [
  { key: "yield", label: "Indicative yield" },
  { key: "risk", label: "Risk" },
  { key: "liquidity", label: "Liquidity" },
  { key: "tax", label: "Tax treatment" },
  { key: "purpose", label: "Best for" },
] as const;

/**
 * FD vs debt funds vs bonds.
 *
 * Figures come from the product catalogue source, the only internally
 * consistent set. Every yield carries an INDICATIVE chip and the scoping
 * disclaimer sits directly beneath.
 *
 * A real <table> on desktop for correct semantics, stacked cards on mobile — a
 * five-row table does not survive a 320px viewport, and horizontally scrolling
 * financial figures is how people misread them.
 */
export function Comparison() {
  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow={COMPARISON.eyebrow}
            title={COMPARISON.heading}
            lede={COMPARISON.intro}
          />
        </Reveal>

        {/* Desktop */}
        <Reveal className="mt-16 hidden md:block">
          <table className="w-full text-left">
            <caption className="sr-only">
              Comparison of bank fixed deposits, debt mutual funds and bonds
              across indicative yield, risk, liquidity, tax treatment and
              purpose.
            </caption>
            <thead>
              <tr className="border-navy border-b">
                <th scope="col" className="w-44 pb-6">
                  <span className="sr-only">Attribute</span>
                </th>
                {COMPARISON.columns.map((col) => (
                  <th key={col.name} scope="col" className="px-8 pb-6">
                    <span className="font-display text-display-sm text-navy block">
                      {col.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {ROWS.map((row) => (
                <tr key={row.key}>
                  <th
                    scope="row"
                    className="text-muted py-6 align-top text-xs tracking-[0.1em] uppercase"
                  >
                    {row.label}
                  </th>
                  {COMPARISON.columns.map((col) => (
                    <td key={col.name} className="px-8 py-6 align-top">
                      {row.key === "yield" ? (
                        // Stacked, not inline: column widths differ, so an
                        // inline chip wraps under some figures and not others.
                        <span className="flex flex-col items-start gap-2.5">
                          <span className="font-sans text-stat-sm text-navy tnum">
                            {col.yield}
                          </span>
                          <Chip tone="indicative">Indicative</Chip>
                        </span>
                      ) : (
                        <span className="text-body text-sm">{col[row.key]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Mobile */}
        <Reveal className="mt-14 space-y-5 md:hidden">
          {COMPARISON.columns.map((col) => (
            <div
              key={col.name}
              className={cn(
                "border-line rounded-card border p-7",
                col.highlight && "bg-mist",
              )}
            >
              <div className="border-line mb-6 border-b pb-6">
                <h3 className="font-display text-display-sm text-navy">
                  {col.name}
                </h3>
                <p className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="font-sans text-stat-sm text-navy tnum">
                    {col.yield}
                  </span>
                  <Chip tone="indicative">Indicative</Chip>
                </p>
              </div>

              <dl className="space-y-4">
                {ROWS.filter((r) => r.key !== "yield").map((row) => (
                  <div key={row.key}>
                    <dt className="text-muted text-xs tracking-[0.1em] uppercase">
                      {row.label}
                    </dt>
                    <dd className="text-body mt-1 text-sm">{col[row.key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10">
          <Disclaimer ids={["indicative-yield", "mf-market-risk"]} variant="panel" />
        </Reveal>
      </div>
    </section>
  );
}
