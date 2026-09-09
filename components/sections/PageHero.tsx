import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Interior page hero.
 *
 * Ivory, matching the homepage, so the header's transparent state behaves
 * identically on every route. The <h1> is never wrapped in a motion component
 * — it is the LCP element on every interior page.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="grain relative isolate overflow-hidden">
      <span
        aria-hidden
        className="absolute -top-[30%] -right-[10%] size-[55vw] max-w-[44rem] rounded-full bg-[radial-gradient(circle,var(--color-sand)_0%,transparent_65%)] opacity-70"
      />

      <div className="container-page relative pt-36 pb-16 lg:pt-44 lg:pb-24">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="text-muted flex flex-wrap items-center gap-2 text-xs">
              <li>
                <Link href="/" className="hover:text-charcoal transition-colors">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  <ChevronRight
                    aria-hidden
                    strokeWidth={1.5}
                    className="text-line size-3.5"
                  />
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-charcoal transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className="text-charcoal"
                      aria-current={i === crumbs.length - 1 ? "page" : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl">
          {eyebrow && <Eyebrow className="mb-7">{eyebrow}</Eyebrow>}

          <h1 className="font-display text-display-lg text-charcoal">{title}</h1>

          {lede && (
            <p className="text-body-lg text-body measure-wide mt-8">{lede}</p>
          )}

          {children && <div className="mt-12">{children}</div>}
        </div>
      </div>
    </section>
  );
}
