import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICES, serviceHref } from "@/lib/content/services";

/**
 * CA services.
 *
 * A numbered index rather than a card grid — these are the practice's
 * foundation, not four product tiles.
 */
export function ServicesSection() {
  return (
    <section id="services" className="section scroll-mt-28">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="The practice"
            title="Fifteen years of tax and compliance, still the core."
            lede="The wealth arm exists because our clients kept asking the same question after filing season: what should I actually do with this money?"
            action={
              <ButtonLink href="/services" variant="secondary" withArrow>
                All CA services
              </ButtonLink>
            }
          />
        </Reveal>

        <Reveal preset="stagger" className="mt-16" tall>
          <ul className="border-line divide-line divide-y border-t">
            {SERVICES.map((service, i) => (
              <RevealItem key={service.slug} as="li">
                <Link
                  href={serviceHref(service.slug)}
                  className="group grid gap-4 py-9 transition-colors duration-400 md:grid-cols-[4rem_minmax(0,18rem)_minmax(0,1fr)_auto] md:items-baseline md:gap-10"
                >
                  <span
                    aria-hidden
                    className="text-muted text-xs tabular-nums transition-colors duration-400"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-display text-display-sm text-navy group-hover:text-accent-ink transition-colors duration-400">
                    {service.name}
                  </h3>

                  <p className="text-body measure text-sm">
                    {service.description}
                  </p>

                  <span className="text-muted group-hover:text-navy flex items-center gap-2 text-xs tracking-[0.1em] uppercase transition-colors duration-400">
                    Read more
                    <ArrowRight
                      aria-hidden
                      strokeWidth={1.75}
                      className="size-3.5 transition-transform duration-400 ease-[var(--ease-editorial)] group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
