import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PILLARS, WHY_INTRO, WHY_QUOTE } from "@/lib/content/homepage";

/**
 * Why Sarvam — three pillars beside a pull quote.
 *
 * The quote panel is charcoal: one small dark block inside a light section,
 * which gives the page a beat without spending a whole dark section on it.
 */
export function WhySarvam() {
  return (
    <section className="bg-sand section">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-24">
          <div>
            <Reveal>
              <SectionHeader
                eyebrow={WHY_INTRO.eyebrow}
                title={WHY_INTRO.heading}
                lede={WHY_INTRO.body}
              />
            </Reveal>

            <Reveal preset="stagger" className="mt-16" tall>
              <ol className="border-line divide-line divide-y border-t">
                {PILLARS.map((pillar) => (
                  <RevealItem key={pillar.index} as="li" className="flex gap-8 py-8">
                    <span
                      aria-hidden
                      className="text-muted w-7 shrink-0 pt-1.5 text-xs tabular-nums"
                    >
                      {String(pillar.index).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-display-sm text-charcoal">
                        {pillar.title}
                      </h3>
                      <p className="text-body measure mt-3 text-sm">
                        {pillar.description}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </ol>
            </Reveal>
          </div>

          <Reveal className="lg:pt-24">
            <figure className="bg-charcoal grain rounded-panel relative isolate overflow-hidden p-10 lg:p-14">
              <blockquote className="font-display text-ivory text-display-md italic">
                {WHY_QUOTE.quote}
              </blockquote>

              <figcaption className="text-eyebrow text-ivory/45 mt-10 flex items-center gap-3.5 uppercase">
                <span aria-hidden className="accent-rule shrink-0" />
                {WHY_QUOTE.attribution}
              </figcaption>

              <p className="border-ivory/12 text-ivory/60 mt-12 border-t pt-10 text-sm">
                We are a chartered accountancy practice first. That means when
                we look at an investment, we are already looking at what it does
                to your tax position — which is a conversation most investors
                never get to have.
              </p>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
