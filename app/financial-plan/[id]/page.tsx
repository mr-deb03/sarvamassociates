import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { PlanLocked } from "@/components/plan/PlanLocked";
import { PlanReport } from "@/components/plan/PlanReport";
import { PrintButton } from "@/components/plan/PrintButton";
import { COMPANY } from "@/lib/content/company";
import { hasPlanAccess } from "@/lib/plan/access";
import { maskPhone } from "@/lib/plan/sms";
import { getStore } from "@/lib/plan/store";

/**
 * A generated plan.
 *
 * Two gates, both needed. The id is unguessable, and the signed cookie from
 * lib/plan/access.ts must name this same id — so a link pasted into a group
 * chat opens the locked screen rather than someone's finances.
 */

export const metadata: Metadata = {
  title: "Your financial plan",
  // Never indexed, never followed, never cached by a proxy. These pages hold
  // personal financial data and exist for one reader.
  robots: { index: false, follow: false, nocache: true },
};

/** Always rendered per request: the cookie decides what comes back. */
export const dynamic = "force-dynamic";

function PlanUnavailable() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="border-line bg-card rounded-card mx-auto max-w-lg border p-8 text-center sm:p-10">
          <h1 className="font-display text-navy text-xl font-semibold sm:text-2xl">
            We cannot open your plan just now
          </h1>
          <p className="text-body mt-3 text-sm leading-relaxed">
            This is a problem at our end, not yours, and your plan has not been
            lost. Please try again in a few minutes — or email{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-accent-ink link-underline"
            >
              {COMPANY.email}
            </a>{" "}
            and we will send it across directly.
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function PlanPage({ params }: PageProps<"/financial-plan/[id]">) {
  const { id } = await params;

  const store = await getStore();

  let record;
  try {
    record = await store.get(id);
  } catch (error) {
    // The store is down. A visitor returning to their own plan should get a
    // sentence they can act on, not a stack trace behind a 500.
    console.error("[plan] could not read the store:", error);
    return <PlanUnavailable />;
  }

  if (!record) notFound();

  const allowed = await hasPlanAccess(id);

  if (!allowed || record.status !== "verified") {
    return (
      <section className="section">
        <div className="container-page">
          <PlanLocked planId={id} maskedPhone={maskPhone(record.input.phone)} />
        </div>
      </section>
    );
  }

  return (
    <section className="section-sm">
      <div className="container-page">
        <div className="mb-10 flex flex-wrap items-center justify-end gap-3 print:hidden">
          <ButtonLink href="/contact" variant="secondary">
            Book a conversation
          </ButtonLink>
          <PrintButton />
        </div>

        <PlanReport record={record} />
      </div>
    </section>
  );
}
