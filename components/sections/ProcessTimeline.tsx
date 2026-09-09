import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PROCESS } from "@/lib/content/homepage";
import { TimelineProgress } from "./TimelineProgress";

/**
 * The four-step process. Horizontal on desktop, vertical on mobile.
 *
 * Step content is entirely server-rendered; only the progress rail behind it is
 * scroll-linked. The rail is the site's other sanctioned champagne moment — a
 * single hairline that fills as you read, which is exactly what the accent is
 * reserved for.
 *
 * Copy is verbatim from the August 2026 revision document.
 */
export function ProcessTimeline({ compact = false }: { compact?: boolean }) {
  return (
    <section className="bg-forest grain section relative isolate overflow-hidden">
      <div className="container-page relative">
        <Reveal>
          <SectionHeader
            onDark
            align="center"
            eyebrow="The process"
            title="From conversation to compounding."
            lede={
              compact
                ? undefined
                : "Four steps, no surprises. The first one is free and carries no obligation — including the obligation to invest anything at all."
            }
          />
        </Reveal>

        <div className="mt-20">
          <TimelineProgress>
            <Reveal preset="stagger" tall>
              <ol className="grid gap-12 lg:grid-cols-4 lg:gap-10">
                {PROCESS.map((step) => (
                  <RevealItem
                    key={step.step}
                    as="li"
                    className="relative pl-14 lg:pt-14 lg:pl-0"
                  >
                    <span
                      aria-hidden
                      className="border-champagne/50 bg-forest text-champagne absolute top-0 left-0 z-1 grid size-9 place-items-center rounded-pill border text-xs tabular-nums lg:left-0"
                    >
                      {String(step.step).padStart(2, "0")}
                    </span>

                    <h3 className="font-display text-ivory text-display-sm">
                      {step.title}
                    </h3>
                    <p className="text-ivory/60 measure mt-3 text-sm">
                      {step.description}
                    </p>
                  </RevealItem>
                ))}
              </ol>
            </Reveal>
          </TimelineProgress>
        </div>

        {!compact && (
          <Reveal className="mt-20 text-center">
            <ButtonLink href="/contact" variant="primaryOnDark" size="lg" withArrow>
              Book your free consultation
            </ButtonLink>
            <p className="text-ivory/50 mt-6 text-sm">
              15 minutes. No commitment. No sales script.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
