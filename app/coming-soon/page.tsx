import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { COMPANY, REGISTRATIONS } from "@/lib/content/company";
import { DISCLAIMERS } from "@/lib/content/disclaimers";
import { isSiteLive } from "@/lib/launch";

/* ==========================================================================
   The holding page.

   proxy.ts rewrites every path here until SITE_LIVE=true, so this is the whole
   site for now — and the only page some people will ever have seen of it. It
   is a navy full-bleed panel rather than a page inside the usual chrome: the
   site header links to pages that all lead back here, and a nav where every
   item is the same page is worse than no nav.

   `fixed inset-0 z-150` is how it escapes that chrome without restructuring
   the root layout into route groups. It covers the header (z-50), the mobile
   CTA bar (z-40) and the mobile nav panel (z-100), and leaves the skip link
   (z-200) reachable. The alternative — having the layout read a header set by
   the proxy — would make every page in the app dynamic.

   NO DATE, AND NO COUNTDOWN. There was one, and it was a mistake: a promised
   date is a promise, and this page cannot keep it. "Shortly" costs nothing if
   the work runs long, where a visible clock running out does.
   ========================================================================== */

export const metadata: Metadata = {
  title: "Sarvam Associates — opening soon",
  description:
    "Tax, compliance and wealth under one roof. A Mumbai chartered accountancy practice of 15+ years. Our new site opens shortly.",
  // Nothing here should be what a search for the practice turns up next month.
  robots: { index: false, follow: false },
};

/*
   Per request, not per build. A page baked at build time would keep its
   "are we open yet" answer forever, and the redirect below would either never
   fire or fire from the moment it was built.
*/
export const dynamic = "force-dynamic";

export default function ComingSoonPage() {
  // Reached directly after go-live — a bookmark, or a link someone kept.
  if (isSiteLive()) redirect("/");

  return (
    <div className="bg-navy grain fixed inset-0 z-150 isolate overflow-y-auto">
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[90vw] max-w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-navy-600)_0%,transparent_65%)] opacity-70"
      />

      <div className="relative flex min-h-full flex-col">
        <header className="container-page pt-10 sm:pt-14">
          <Logo onDark href="/coming-soon" priority />
        </header>

        <main className="container-page flex flex-1 flex-col justify-center py-16 text-center sm:py-24">
          <p className="text-eyebrow text-accent-light/70 uppercase">
            A new home, opening soon
          </p>

          <h1 className="font-display text-paper text-display-lg mx-auto mt-6 max-w-[16ch]">
            Something considered is on its way.
          </h1>

          <p className="text-body-lg text-paper/65 measure-wide mx-auto mt-8">
            For over fifteen years Sarvam Associates has handled tax and
            compliance for families and businesses across Mumbai. We are
            bringing the same relationship to how our clients invest, and we
            would rather open this properly than quickly.
          </p>

          {/* Three facts that are true today, so the page says something
              rather than only promising something. */}
          <ul className="border-paper/12 divide-paper/10 mx-auto mt-14 grid max-w-3xl divide-y border-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { figure: `${COMPANY.foundedYearsAgo}+`, label: "Years in practice" },
              { figure: "Bhandup", label: "West, Mumbai" },
              { figure: "Tax & wealth", label: "Under one roof" },
            ].map((item) => (
              <li key={item.label} className="px-6 py-7">
                <p className="font-display text-paper text-xl font-bold sm:text-2xl">
                  {item.figure}
                </p>
                <p className="text-paper/45 mt-1.5 text-xs tracking-[0.06em] uppercase">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>

          <p className="text-paper/45 mt-14 text-sm">
            Until then, we are reachable exactly as we always have been.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-5 text-sm sm:flex-row sm:gap-10">
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-paper/80 hover:text-paper flex items-center gap-2.5 transition-colors"
            >
              <Mail aria-hidden strokeWidth={1.5} className="text-accent size-4" />
              {COMPANY.email}
            </a>
            <span className="text-paper/55 flex items-center gap-2.5">
              <MapPin aria-hidden strokeWidth={1.5} className="text-accent size-4" />
              {COMPANY.address.locality}, {COMPANY.address.city}
            </span>
          </div>
        </main>

        <footer className="border-paper/10 container-page border-t py-8">
          <p className="text-paper/40 measure-wide mx-auto text-center text-xs leading-relaxed">
            {DISCLAIMERS["mf-market-risk"].body}{" "}
            {DISCLAIMERS["distributor-role"].body}
          </p>
          <p className="text-paper/30 mt-4 text-center text-xs">
            © {new Date().getFullYear()} {COMPANY.legalName}
            {REGISTRATIONS.hasArn ? ` · AMFI ${REGISTRATIONS.arn}` : ""}
          </p>
        </footer>
      </div>
    </div>
  );
}
