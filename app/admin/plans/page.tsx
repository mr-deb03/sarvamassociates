import { PlansTable } from "@/components/admin/PlansTable";
import { adminStore } from "@/lib/plan/admin-data";
import { smsConfigured } from "@/lib/plan/sms";

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

  const items = await store.list();

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

        <PlansTable items={items} />
      </div>
    </section>
  );
}
