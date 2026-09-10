import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

/**
 * Shared shell for the three legal pages.
 *
 * Body copy is set at full body size on a narrow measure. Legal text that
 * nobody can read is not disclosure, and brief §47 calls out tiny disclaimer
 * text specifically.
 */
export function LegalPage({
  title,
  intro,
  sections,
  updated,
  crumb,
  path,
  footer,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  updated: string;
  crumb: string;
  path: string;
  footer?: ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: crumb, path },
        ]}
      />

      <PageHero
        eyebrow="Legal"
        title={title}
        lede={intro}
        crumbs={[{ label: crumb }]}
      />

      <section className="bg-paper section-sm">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <p className="text-muted border-line mb-10 border-b pb-6 text-xs tracking-[0.08em] uppercase">
              Last updated {updated}
            </p>

            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-navy text-xl font-semibold lg:text-2xl">
                    {section.heading}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-body mt-4 text-sm leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="mt-4 space-y-2.5">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-body flex gap-3 text-sm leading-relaxed"
                        >
                          <span
                            aria-hidden
                            className="bg-muted/60 mt-2.5 size-1 shrink-0 rounded-full"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {footer && <div className="mt-12">{footer}</div>}
          </div>
        </div>
      </section>
    </>
  );
}
