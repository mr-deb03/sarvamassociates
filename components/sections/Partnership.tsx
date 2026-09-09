import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PARTNER } from "@/lib/content/company";

/**
 * Institutional access — the site's first full dark section.
 *
 * The compliance-critical job here is keeping two roles legible and distinct:
 * Nuvama MANUFACTURES and issues the products; Sarvam DISTRIBUTES them. The
 * two-panel split below says so in as many words, because blurring them is the
 * most common misrepresentation in this category and the easiest to make by
 * accident.
 *
 * Bullet copy is from the August 2026 revision document.
 */

const POINTS = [
  "Access to a full suite of institutional-grade investment products",
  "Every recommendation backed by research, not guesswork, not gut feeling",
  "Tax and wealth planning under one roof — your CA and your advisor, finally on the same page",
  "Fully digital onboarding, with a real person reviewing every step",
  "A dedicated relationship manager, from day one — not a call centre",
];

export function Partnership() {
  return (
    <section className="bg-charcoal grain section relative isolate overflow-hidden">
      <span
        aria-hidden
        className="absolute -top-1/3 -right-[10%] size-[45vw] max-w-[40rem] rounded-full bg-[radial-gradient(circle,var(--color-forest-600)_0%,transparent_66%)] opacity-60"
      />

      <div className="container-page relative">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-24">
          <div>
            <Reveal>
              <SectionHeader
                onDark
                eyebrow="Our institutional partner"
                title={
                  <>
                    Institutional strength.
                    <br />
                    <span className="italic">Boutique relationship.</span>
                  </>
                }
                lede="Sarvam Associates gives you access to institutional-grade investment platforms and research — the kind of scale and infrastructure usually reserved for large institutions — backed by the personal relationship and accountability you deserve from an advisor who actually knows you."
              />
            </Reveal>

            <Reveal className="mt-14">
              <ul className="border-ivory/12 divide-ivory/10 divide-y border-t">
                {POINTS.map((point) => (
                  <li key={point} className="text-ivory/70 py-4 text-sm">
                    {point}
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/contact"
                variant="primaryOnDark"
                size="lg"
                className="mt-12"
                withArrow
              >
                Start a conversation
              </ButtonLink>
            </Reveal>
          </div>

          {/* Who does what */}
          <Reveal className="lg:pt-20">
            <h3 className="text-eyebrow text-ivory/45 mb-8 flex items-center gap-3.5 uppercase">
              <span aria-hidden className="accent-rule shrink-0" />
              Who does what
            </h3>

            <dl className="space-y-4">
              <div className="border-ivory/12 bg-ivory/[0.04] rounded-card border p-8">
                <dt className="font-display text-ivory text-display-sm">
                  {PARTNER.legalName}
                </dt>
                <dd className="text-ivory/60 mt-4 text-sm">
                  <span className="text-ivory/90 font-medium">
                    Manufactures and issues the products.
                  </span>{" "}
                  Runs the investment strategies and makes every buy and sell
                  decision inside them. {PARTNER.description}
                </dd>
              </div>

              <div className="border-ivory/12 bg-ivory/[0.04] rounded-card border p-8">
                <dt className="font-display text-ivory text-display-sm">
                  Sarvam Associates
                </dt>
                <dd className="text-ivory/60 mt-4 text-sm">
                  <span className="text-ivory/90 font-medium">
                    Distributes them, as an authorised partner.
                  </span>{" "}
                  Assesses whether a product suits you, handles onboarding and
                  paperwork, and manages your relationship and reviews. Does not
                  manage any portfolio and does not issue any product.
                </dd>
              </div>
            </dl>

            <Disclaimer ids={["nuvama-facilitation"]} onDark className="mt-8" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
