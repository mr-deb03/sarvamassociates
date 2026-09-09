import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Chip } from "@/components/ui/Chip";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NUMBERS, SARVAM_METRICS } from "@/lib/content/homepage";
import type { Stat } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * "The Numbers" — the highest-risk block on the site. Three rules govern it:
 *
 * 1. Attribution is explicit. The ₹1L Cr+ AUM and 1M+ investor figures belong
 *    to the partner platform, not to Sarvam, and each card says so. Presenting
 *    a partner's AUM as your own is the classic misrepresentation here.
 * 2. Indicative figures never count up. Animating a return range dramatises it
 *    and implies it is being achieved, so the 8.5–12% card renders statically
 *    with a visible INDICATIVE chip.
 * 3. The scoping disclaimer sits directly beneath the grid, not in the footer.
 *
 * Figures are set in Manrope, tight and tabular — precise and institutional
 * rather than promotional. The display serif is for statements, not statistics.
 */
export function Numbers() {
  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="The numbers"
            title="The scale behind the relationship"
            lede="Two of these figures describe the platform we distribute through, not our own book — so they are labelled that way. The other two describe how specific products are structured."
          />
        </Reveal>

        {/* Sarvam's own record, kept visually distinct from platform figures. */}
        <Reveal preset="stagger" className="mt-16">
          <ul className="border-line divide-line grid divide-y border-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {SARVAM_METRICS.map((stat) => (
              <RevealItem
                key={stat.id}
                as="li"
                className="py-10 sm:px-10 sm:first:pl-0 sm:last:pr-0"
              >
                <StatValue stat={stat} className="text-charcoal" />
                <p className="text-body mt-4 text-sm">{stat.label}</p>
                <p className="text-muted mt-1 text-xs">Sarvam Associates</p>
              </RevealItem>
            ))}
          </ul>
        </Reveal>

        {/* Platform and product figures. */}
        <Reveal preset="stagger" className="mt-6" tall>
          {/* The 1px gaps are the dividers, so the grid's own background has to
              be the line colour — sand on sand shows nothing. */}
          <ul className="bg-line rounded-panel grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
            {NUMBERS.map((stat) => (
              <RevealItem
                key={stat.id}
                as="li"
                className="bg-sand flex flex-col p-8 lg:p-10"
              >
                {stat.indicative && (
                  <Chip tone="indicative" className="mb-6 self-start">
                    Indicative
                  </Chip>
                )}

                <StatValue
                  stat={stat}
                  className="text-charcoal"
                  size="text-stat-sm"
                />

                <p className="text-body mt-4 text-sm">{stat.label}</p>

                {stat.attribution && (
                  <p className="border-charcoal/10 text-muted mt-auto border-t pt-5 text-xs">
                    {stat.attribution}
                  </p>
                )}
              </RevealItem>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-8">
          <Disclaimer
            ids={["platform-facilitation", "mld-capital-protection"]}
            variant="panel"
          />
        </Reveal>
      </div>
    </section>
  );
}

function StatValue({
  stat,
  className,
  size = "text-stat",
}: {
  stat: Stat;
  className: string;
  size?: string;
}) {
  const base = cn("font-sans tnum", size, className);

  // Ranges and anything marked noAnimate render statically.
  if (stat.value === null || stat.noAnimate) {
    return (
      <p className={base}>
        {stat.displayOverride ?? `${stat.prefix ?? ""}${stat.suffix ?? ""}`}
      </p>
    );
  }

  return (
    <p className={base}>
      <AnimatedCounter
        value={stat.value}
        prefix={stat.prefix}
        suffix={stat.suffix}
      />
    </p>
  );
}
