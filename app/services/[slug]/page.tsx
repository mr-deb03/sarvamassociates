import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Info, UserRound } from "lucide-react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  ALL_SERVICE_SLUGS,
  getService,
  SERVICES,
  serviceHref,
  type ServiceBlock,
} from "@/lib/content/services";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return ALL_SERVICE_SLUGS.map((slug) => ({ slug }));
}

/** An unknown slug 404s at build time rather than attempting a runtime render. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return buildMetadata({ ...service.seo, path: serviceHref(slug) });
}

export default async function ServicePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <ServiceJsonLd service={service} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "CA Services", path: "/services" },
          { name: service.name, path: serviceHref(service.slug) },
        ]}
      />

      <PageHero
        eyebrow={service.eyebrow}
        title={service.name}
        lede={service.lede}
        crumbs={[
          { label: "CA Services", href: "/services" },
          { label: service.shortName },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href="/contact" size="lg" withArrow>
            Talk to us about this
          </ButtonLink>
          <ButtonLink href="/services" variant="tertiary" size="lg" withArrow>
            All CA services
          </ButtonLink>
        </div>
      </PageHero>

      {/* ---------- Intro ---------- */}
      <section className="section">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
            <Reveal>
              <SectionHeader eyebrow="Overview" title="What this covers" />
            </Reveal>
            <Reveal tall>
              <div className="space-y-5">
                {service.intro.map((para) => (
                  <p key={para} className="text-body-lg text-body">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Detail blocks ---------- */}
      <section className="bg-mist section">
        <div className="container-page">
          <Reveal>
            <SectionHeader eyebrow="In detail" title="How we work on it" />
          </Reveal>

          <div className="mt-16 space-y-5">
            {service.blocks.map((block) => (
              <Reveal key={block.heading}>
                <ServiceBlockCard block={block} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Who it's for ---------- */}
      <section className="bg-navy grain section relative isolate overflow-hidden">
        <div className="container-page relative">
          <Reveal>
            <SectionHeader
              onDark
              eyebrow="Who it's for"
              title="You'll get the most out of this if…"
            />
          </Reveal>

          <Reveal preset="stagger" className="mt-14" tall>
            <ul className="grid gap-4 sm:grid-cols-2">
              {service.whoItsFor.map((who) => (
                <RevealItem
                  key={who}
                  as="li"
                  className="border-paper/12 bg-paper/[0.04] rounded-card flex items-start gap-4 border p-6"
                >
                  <UserRound
                    aria-hidden
                    strokeWidth={1.5}
                    className="text-accent mt-0.5 size-5 shrink-0"
                  />
                  <span className="text-paper/75 text-sm">{who}</span>
                </RevealItem>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-12">
            <Disclaimer ids={service.disclaimerIds} onDark variant="panel" />
          </Reveal>
        </div>
      </section>

      {/* ---------- Other services ---------- */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow="Also from the practice"
              title="The rest of what we do"
              size="md"
            />
          </Reveal>

          <Reveal preset="stagger" className="mt-12" tall>
            <ul className="grid gap-5 sm:grid-cols-3">
              {others.map((other) => (
                <RevealItem key={other.slug} as="li">
                  <Link
                    href={serviceHref(other.slug)}
                    className="group border-line bg-card rounded-card hover:border-navy/25 flex h-full flex-col border p-7 transition-[border-color,transform] duration-400 ease-[var(--ease-editorial)] hover:-translate-y-0.5"
                  >
                    <h3 className="font-display text-display-sm text-navy">
                      {other.name}
                    </h3>
                    <p className="text-body mt-3 mb-6 text-sm">
                      {other.description}
                    </p>
                    <ArrowRight
                      aria-hidden
                      strokeWidth={1.75}
                      className="text-muted group-hover:text-navy mt-auto size-4 transition-all duration-400 ease-[var(--ease-editorial)] group-hover:translate-x-1"
                    />
                  </Link>
                </RevealItem>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaSection
        eyebrow="Next step"
        title="Let's look at your actual situation."
        body="Fifteen minutes on a call, no obligation. Bring the notice, the spreadsheet or the question you've been putting off."
        primary={{ label: "Book a Consultation", href: "/contact" }}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function ServiceBlockCard({ block }: { block: ServiceBlock }) {
  return (
    <div className="border-line bg-card rounded-card border p-8 lg:p-10">
      <h3 className="font-display text-display-sm text-navy">{block.heading}</h3>

      {block.body && (
        <div className="mt-5 space-y-4">
          {block.body.map((para) => (
            <p key={para} className="text-body measure-wide text-sm">
              {para}
            </p>
          ))}
        </div>
      )}

      {block.bullets && (
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 sm:gap-x-10">
          {block.bullets.map((item) => (
            <li key={item} className="text-body flex gap-3.5 text-sm">
              <Check
                aria-hidden
                strokeWidth={2.5}
                className="text-positive mt-1 size-4 shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      )}

      {block.steps && (
        <ol className="border-line mt-8 grid gap-6 border-t pt-8 sm:grid-cols-3">
          {block.steps.map((step, i) => (
            <li key={step.title}>
              <span
                aria-hidden
                className="text-muted block text-xs tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="text-navy mt-2 text-sm font-semibold">
                {step.title}
              </h4>
              <p className="text-body mt-1.5 text-sm">{step.description}</p>
            </li>
          ))}
        </ol>
      )}

      {/*
        Set apart rather than inline. These notes exist because the source copy
        quoted statutory figures that have since moved; saying so plainly is
        better than reprinting a stale number or silently dropping the subject.
      */}
      {block.note && (
        <p className="border-accent/40 text-body mt-8 flex items-start gap-3 border-l-2 py-1 pl-5 text-xs">
          <Info
            aria-hidden
            strokeWidth={1.75}
            className="text-muted mt-0.5 size-4 shrink-0"
          />
          {block.note}
        </p>
      )}
    </div>
  );
}
