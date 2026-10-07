import type { Metadata } from "next";
import { Clock, FileText, Lock, ShieldCheck } from "lucide-react";
import { PlanWizard } from "@/components/plan/PlanWizard";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Build Your Financial Plan",
  description:
    "Map your income, goals and holdings and get a free illustrative financial plan in about ten minutes. Built by a Mumbai chartered accountancy practice. No PAN, no Aadhaar, no bank details.",
  path: "/financial-plan",
});

const ASSURANCES = [
  {
    icon: Clock,
    title: "About ten minutes",
    body: "Five short steps. Your answers are kept in this browser as you go, so you can stop and come back.",
  },
  {
    icon: Lock,
    title: "Nothing sensitive asked",
    body: "No PAN, no Aadhaar, no bank or folio details. Round figures are all this needs.",
  },
  {
    icon: FileText,
    title: "A document, not a teaser",
    body: "Goal by goal, with the arithmetic shown. Yours to download, print or argue with.",
  },
  {
    icon: ShieldCheck,
    title: "An illustration, plainly labelled",
    body: "Built from your figures and your assumptions. It is not advice, and it says so throughout.",
  },
];

export default function FinancialPlanPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Financial plan", path: "/financial-plan" },
        ]}
      />

      <PageHero
        eyebrow="Free planning tool"
        title={
          <>
            See the whole picture,{" "}
            <span className="italic">before</span> anyone sells you anything.
          </>
        }
        lede="Tell us what you earn, what you spend and what you are saving for. We will show you what each goal is likely to cost by the time it arrives, what your current arrangements will actually cover, and what the gap would take to close."
        crumbs={[{ label: "Financial plan" }]}
      />

      <section className="bg-paper section-sm">
        <div className="container-page">
          <ul className="border-line divide-line grid gap-0 divide-y border-y lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {ASSURANCES.map((item) => (
              <li key={item.title} className="py-7 lg:px-7 lg:first:pl-0 lg:last:pr-0">
                <item.icon
                  aria-hidden
                  strokeWidth={1.5}
                  className="text-accent size-5"
                />
                <h2 className="text-navy mt-4 text-sm font-semibold">
                  {item.title}
                </h2>
                <p className="text-muted mt-1.5 text-xs leading-relaxed">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
            <div className="min-w-0">
              <PlanWizard />
            </div>

            <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
              <div className="border-line bg-card rounded-card border p-6">
                <h2 className="font-display text-navy text-base font-semibold">
                  What you will end up with
                </h2>
                <ol className="mt-5 space-y-4">
                  {[
                    "A month-by-month view of where your money actually goes",
                    "Every goal priced at what it will cost in the year you need it",
                    "What your current saving will genuinely cover, and what it will not",
                    "A retirement corpus figure, with the arithmetic shown",
                    "Your target asset mix against what you really hold",
                  ].map((line, index) => (
                    <li key={line} className="flex gap-3.5">
                      <span
                        aria-hidden
                        className="text-muted w-5 shrink-0 text-xs font-medium tabular-nums"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body text-xs leading-relaxed">
                        {line}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <Disclaimer
                ids={["plan-illustration", "plan-data-handling"]}
                variant="panel"
              />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
