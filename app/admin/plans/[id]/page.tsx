import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { DeletePlanButton } from "@/components/admin/DeletePlanButton";
import { StatusChip } from "@/components/admin/PlansTable";
import { PlanReport } from "@/components/plan/PlanReport";
import { PrintButton } from "@/components/plan/PrintButton";
import { adminStore } from "@/lib/plan/admin-data";
import { dateTimeDisplay, phoneDisplay } from "@/lib/plan/format";

/**
 * One submission, in full.
 *
 * The same `PlanReport` the visitor sees, with `forAdmin` adding the contact
 * block and the verification state. Rendering the visitor's own document
 * rather than a separate admin view means an advisor opens the call looking at
 * exactly what the client is looking at.
 */
export default async function AdminPlanDetail({
  params,
}: PageProps<"/admin/plans/[id]">) {
  const { id } = await params;

  const store = await adminStore();
  if (!store) return null;

  const record = await store.get(id);
  if (!record) notFound();

  return (
    <section className="section-sm">
      <div className="container-page">
        <Link
          href="/admin/plans"
          className="text-muted hover:text-navy mb-8 inline-flex items-center gap-1.5 text-sm transition-colors print:hidden"
        >
          <ArrowLeft strokeWidth={1.75} aria-hidden className="size-4" />
          All submissions
        </Link>

        <div className="border-line bg-card rounded-card mb-10 border p-6 print:hidden sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-navy text-lg font-semibold">
                  {record.contact.name}
                </h1>
                <StatusChip status={record.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <a
                  href={`tel:+91${record.contact.phone}`}
                  className="text-navy hover:text-accent-ink flex items-center gap-2 transition-colors"
                >
                  <Phone strokeWidth={1.75} aria-hidden className="text-accent size-3.5" />
                  <span className="tabular-nums">{phoneDisplay(record.contact.phone)}</span>
                </a>
                <a
                  href={`mailto:${record.contact.email}`}
                  className="text-navy hover:text-accent-ink flex items-center gap-2 transition-colors"
                >
                  <Mail strokeWidth={1.75} aria-hidden className="text-accent size-3.5" />
                  {record.contact.email}
                </a>
              </div>
            </div>

            <PrintButton label="Print / PDF" variant="secondary" />
          </div>

          <dl className="border-line text-muted mt-6 grid gap-x-8 gap-y-2.5 border-t pt-5 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <Meta label="Received" value={dateTimeDisplay(record.createdAt)} />
            <Meta
              label="Verified"
              value={
                record.verifiedAt
                  ? dateTimeDisplay(record.verifiedAt)
                  : "Not yet — number unconfirmed"
              }
            />
            <Meta label="Reference" value={record.id} />
            <Meta
              label="Flags"
              value={
                [
                  record.input.wantsWill && "wants a will",
                  record.input.wantsInsuranceReview && "wants protection review",
                ]
                  .filter(Boolean)
                  .join(", ") || "none"
              }
            />
          </dl>

          <div className="border-line mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
            <p className="text-muted text-xs">
              Source: {record.meta.referer ?? "direct"}
            </p>
            <DeletePlanButton planId={record.id} />
          </div>
        </div>

        <PlanReport record={record} forAdmin />
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted/80 text-[0.6875rem] tracking-[0.08em] uppercase">
        {label}
      </dt>
      <dd className="text-body mt-0.5">{value}</dd>
    </div>
  );
}
