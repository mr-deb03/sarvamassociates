import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { COMPANY } from "@/lib/content/company";
import { PROCESS } from "@/lib/content/homepage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Book a Consultation",
  description:
    "Book a free 15-minute consultation with Sarvam Associates in Bhandup West, Mumbai. No obligation, no sales script — including an honest answer if you don't need us.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Let&rsquo;s build your{" "}
            <span className="italic">financial plan</span> together.
          </>
        }
        lede="Fifteen minutes on a call. We ask about your goals, your timeline and what you already hold — then tell you honestly whether we can add anything."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="bg-ivory section-sm">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.85fr] lg:gap-16">
            <div>
              <ConsultationForm />
            </div>

            <aside className="space-y-8">
              {/* Contact details */}
              <div className="border-line rounded-card border bg-ivory p-7">
                <h2 className="font-display text-charcoal text-lg font-semibold">
                  Reach us directly
                </h2>

                <dl className="mt-5 space-y-5">
                  <div className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="bg-charcoal/[0.05] text-charcoal grid size-9 shrink-0 place-items-center rounded-full"
                    >
                      <MapPin strokeWidth={1.75} className="size-4" />
                    </span>
                    <div>
                      <dt className="text-muted text-xs tracking-[0.08em] uppercase">
                        Office
                      </dt>
                      <dd className="text-body mt-1 text-sm leading-relaxed not-italic">
                        {COMPANY.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="bg-charcoal/[0.05] text-charcoal grid size-9 shrink-0 place-items-center rounded-full"
                    >
                      <Mail strokeWidth={1.75} className="size-4" />
                    </span>
                    <div>
                      <dt className="text-muted text-xs tracking-[0.08em] uppercase">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm">
                        <a
                          href={`mailto:${COMPANY.email}`}
                          className="text-charcoal link-underline"
                        >
                          {COMPANY.email}
                        </a>
                      </dd>
                    </div>
                  </div>

                  {COMPANY.phone && (
                    <div className="flex gap-3.5">
                      <span
                        aria-hidden
                        className="bg-charcoal/[0.05] text-charcoal grid size-9 shrink-0 place-items-center rounded-full"
                      >
                        <Clock strokeWidth={1.75} className="size-4" />
                      </span>
                      <div>
                        <dt className="text-muted text-xs tracking-[0.08em] uppercase">
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm">
                          <a
                            href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                            className="text-charcoal link-underline"
                          >
                            {COMPANY.phone}
                          </a>
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>

              {/* What happens next */}
              <div className="bg-charcoal grain relative isolate overflow-hidden rounded-card p-7">
                <h2 className="font-display text-ivory text-lg font-semibold">
                  What happens next
                </h2>

                <ol className="mt-5 space-y-4">
                  {PROCESS.map((step) => (
                    <li key={step.step} className="flex gap-3.5">
                      <span
                        aria-hidden
                        className="font-display text-ivory/45 w-6 shrink-0 text-sm font-bold tabular-nums"
                      >
                        {String(step.step).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-ivory text-sm font-medium">
                          {step.title}
                        </h3>
                        <p className="text-ivory/45 mt-0.5 text-xs leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <Disclaimer
                ids={["not-investment-advice", "distributor-role"]}
                variant="panel"
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
