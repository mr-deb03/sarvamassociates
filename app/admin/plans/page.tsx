import { PlansTable } from "@/components/admin/PlansTable";
import { StorageError } from "@/components/admin/StorageError";
import { adminStore } from "@/lib/plan/admin-data";
import { smsConfigured } from "@/lib/plan/sms";
import {
  describeStoreError,
  storageLocation,
  type PlanSummary,
} from "@/lib/plan/store";

/**
 * Every plan submission, newest first.
 *
 * Unverified rows are shown alongside verified ones because they are still
 * real enquiries — someone filled in five steps of a form and asked for the
 * result. The status chip is there so nobody mistakes an unconfirmed number
 * for one that answered.
 */
export default async function AdminPlansPage() {
  // Null means not signed in. The layout is already showing the sign-in form,
  // so this renders nothing — and, crucially, fetches nothing. See the note in
  // lib/plan/admin-data.ts.
  const store = await adminStore();
  if (!store) return null;

  // A store that cannot be reached is a first-class state here, not an
  // exception. This panel is where someone goes to find out why the site is
  // misbehaving, so it has to render even when the database is down — which,
  // for a database on an office machine behind a tunnel, is a normal Tuesday.
  let items: PlanSummary[] = [];
  let storeError: string | null = null;

  try {
    items = await store.list();
  } catch (error) {
    storeError = describeStoreError(error);
    console.error("[plan] admin list could not read the store:", error);
  }

  return (
    <section className="section-sm">
      <div className="container-page">
        <div className="mb-8">
          <h1 className="font-display text-navy text-display-sm">
            Financial plan submissions
          </h1>
          <p className="text-muted mt-2 text-sm">
            Everything captured by the planner, newest first.
          </p>
        </div>

        {!smsConfigured() && (
          <p className="border-accent/30 bg-accent-light text-accent-ink mb-8 rounded-card border p-4 text-xs leading-relaxed">
            <strong>No SMS provider is configured.</strong> Verification codes
            are written to the server log in development and will not send at
            all in production. Set SMS_PROVIDER and its credentials — see
            .env.example.
          </p>
        )}

        {/* `!== null`, not truthiness — see describeStoreError. */}
        {storeError !== null ? (
          <StorageError target={storageLocation()} detail={storeError} />
        ) : (
          <PlansTable items={items} />
        )}
      </div>
    </section>
  );
}
