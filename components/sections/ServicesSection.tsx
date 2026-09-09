import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICES } from "@/lib/content/homepage";

/**
 * CA services.
 *
 * Set as a numbered index rather than a card grid — these are the practice's
 * foundation, not four product tiles, and all four link out to the existing
 * sarvamassociates.com pages. The source supplies names and URLs but no page
 * content, and empty routes are worse than none.
 */
export function ServicesSection() {
  return (
    <section id="services" className="section scroll-mt-28">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="The practice"
            title="Fifteen years of tax and compliance, still the core."
            lede="The wealth arm exists because our clients kept asking the same question after filing season: what should I actually do with this money? These services remain on our original site."
          />
        </Reveal>

        <Reveal preset="stagger" className="mt-16" tall>
          <ul className="border-line divide-line divide-y border-t">
            {SERVICES.map((service, i) => (
              <RevealItem key={service.name} as="li">
                <a
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-4 py-9 transition-colors duration-400 md:grid-cols-[4rem_minmax(0,18rem)_minmax(0,1fr)_auto] md:items-baseline md:gap-10"
                >
                  <span
                    aria-hidden
                    className="text-muted text-xs tabular-nums transition-colors duration-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-display text-display-sm text-charcoal group-hover:text-champagne-ink transition-colors duration-400">
                    {service.name}
                  </h3>

                  <p className="text-body measure text-sm">
                    {service.description}
                  </p>

                  <span className="text-muted group-hover:text-charcoal flex items-center gap-2 text-xs tracking-[0.1em] uppercase transition-colors duration-400">
                    Visit
                    <ArrowUpRight
                      aria-hidden
                      strokeWidth={1.75}
                      className="size-3.5 transition-transform duration-400 ease-[var(--ease-editorial)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </a>
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
