import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PROBLEM } from "@/lib/content/homepage";

/**
 * The positioning argument, set as a full-width editorial statement.
 *
 * This is the site's first large serif moment after the hero, and it carries
 * the thesis: the chain below is the argument, each link naming what the
 * previous one decides. Numbered hairline rows rather than cards — cards would
 * make five sequential ideas read as five parallel features.
 */
export function Problem() {
  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <Eyebrow className="mb-8">{PROBLEM.eyebrow}</Eyebrow>
          <h2 className="font-display text-display-lg text-navy max-w-[20ch]">
            {PROBLEM.heading}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <Reveal>
            <p className="text-body-lg text-body">{PROBLEM.body}</p>
            <p className="font-display text-display-sm text-navy mt-10">
              {PROBLEM.close}
            </p>
          </Reveal>

          <Reveal preset="stagger" tall>
            {/*
              The label column is sized by content (`max-content`) rather than a
              fixed width, and the rows share it through `subgrid` so they still
              line up. A hard `w-40` was here before: it fitted the old serif but
              not Montserrat Bold, and "Investments" and "Protection" overflowed
              straight across their note text. Content-sizing means the next font
              or the next label cannot reintroduce that.
            */}
            <ol className="border-line divide-line grid divide-y border-t sm:grid-cols-[1.75rem_max-content_minmax(0,1fr)]">
              {PROBLEM.chain.map((link, i) => (
                <RevealItem
                  key={link.label}
                  as="li"
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline gap-x-6 gap-y-1 py-6 sm:col-span-3 sm:grid-cols-subgrid"
                >
                  <span
                    aria-hidden
                    className="text-muted w-7 shrink-0 text-xs tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-display-sm text-navy">
                    {link.label}
                  </span>
                  <span className="text-body col-start-2 text-sm sm:col-start-3">
                    {link.note}
                  </span>
                </RevealItem>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
