import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HERO } from "@/lib/content/homepage";
import { HeroBackdrop } from "./HeroVisual";

/**
 * Homepage hero — the strongest typographic moment on the site.
 *
 * Ivory rather than dark: warm neutral is the dominant ground in this design
 * language, and a dark hero would push the palette's 20% dark share into the
 * first screen. Dark sections earn their weight later, as rhythm.
 *
 * The <h1> is plain server-rendered markup at full opacity — never wrapped in
 * a motion component. An LCP element that starts at opacity 0 is not counted
 * as painted until hydration runs, which pushes LCP by hundreds of
 * milliseconds. Only the backdrop moves.
 *
 * Typographic contrast carries the composition: the Hinglish line in Cormorant
 * italic against the roman second line, then precise Manrope underneath. No
 * colour trick, no chart, no gold.
 */
export function Hero() {
  return (
    <section className="grain relative isolate overflow-hidden">
      <HeroBackdrop />

      <div className="container-page relative z-2 pt-40 pb-20 lg:pt-52 lg:pb-28">
        <Eyebrow className="mb-10">{HERO.eyebrow}</Eyebrow>

        <h1 className="font-display text-display-hero text-navy max-w-[19ch]">
          <span className="block italic">{HERO.headlineLead}</span>
          <span className="block">{HERO.headlineTail}</span>
        </h1>

        {/* Hairline separating the statement from the argument. */}
        <hr className="border-line mt-14 border-t lg:mt-20" />

        <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-20">
          <div>
            <p className="text-body-lg text-body measure-wide">
              {HERO.subhead}
            </p>
            <p className="text-muted mt-6 flex items-center gap-3 text-sm">
              <span
                aria-hidden
                className="bg-accent size-1.5 shrink-0 rounded-full"
              />
              {HERO.trustLine}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href={HERO.primaryCta.href} size="lg" withArrow>
              {HERO.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={HERO.secondaryCta.href}
              variant="tertiary"
              size="lg"
              withArrow
            >
              {HERO.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
