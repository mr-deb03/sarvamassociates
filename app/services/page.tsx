import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICES, serviceHref } from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "CA Services — Tax, GST, Audit & Insurance",
  description:
    "Direct tax, GST and indirect taxation, audit and assurance, and insurance advisory from a Mumbai chartered accountancy practice of 15+ years.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "CA Services", path: "/services" },
        ]}
      />

      <PageHero
        eyebrow="CA Services"
        title="The practice the wealth arm grew out of."
        lede="Sarvam Associates has handled tax and compliance for 15+ years. These four services are the foundation — and the reason we can look at an investment and already know what it does to your tax position."
        crumbs={[{ label: "CA Services" }]}
      />

      <section className="bg-mist section">
        <div className="container-page">
          <Reveal preset="stagger" tall>
            <ul className="grid gap-5 md:grid-cols-2">
              {SERVICES.map((service) => (
                <RevealItem key={service.slug} as="li">
                  <Link
                    href={serviceHref(service.slug)}
                    className="group border-line bg-card rounded-card hover:border-navy/25 flex h-full flex-col border p-8 transition-[border-color,transform] duration-400 ease-[var(--ease-editorial)] hover:-translate-y-0.5 lg:p-10"
                  >
                    <CategoryIcon
                      name={service.icon}
                      className="text-navy size-6"
                    />

                    <h2 className="font-display text-display-md text-navy mt-8">
                      {service.name}
                    </h2>

                    <p className="text-body measure mt-4 mb-8 text-sm">
                      {service.lede}
                    </p>

                    <div className="border-line mt-auto flex items-center justify-between border-t pt-5">
                      <span className="text-muted text-xs tracking-[0.1em] uppercase">
                        {service.blocks.length} areas covered
                      </span>
                      <ArrowRight
                        aria-hidden
                        strokeWidth={1.75}
                        className="text-muted group-hover:text-navy size-4 transition-all duration-400 ease-[var(--ease-editorial)] group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow="Why it matters"
              title="One practice, one view of your finances."
              lede="Most people get their tax from one person and their investments from another, and neither sees the whole. Because the same team does both here, a recommendation is made knowing what it costs you in tax — and a return is filed knowing what you hold."
              action={undefined}
            />
          </Reveal>
        </div>
      </section>

      <CtaSection
        eyebrow="Next step"
        title="Bring us the messy one."
        body="Whether it's a notice you don't understand, a first GST registration or an audit that needs to start on Monday — the first conversation is 15 minutes and costs nothing."
        primary={{ label: "Book a Consultation", href: "/contact" }}
        secondary={{ label: "See investment solutions", href: "/investments" }}
      />
    </>
  );
}
