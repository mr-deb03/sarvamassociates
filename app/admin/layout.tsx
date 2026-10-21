import type { Metadata } from "next";
import { AdminBar } from "@/components/admin/AdminBar";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { isSiteLive } from "@/lib/launch";
import { isAdmin } from "@/lib/plan/access";

/**
 * Admin shell.
 *
 * This renders the sign-in form in place of the panel when there is no valid
 * session — but that is presentation, NOT the security boundary.
 *
 * A layout does not stop its page from running: Next renders the page segment
 * regardless, so anything the page fetches is serialised into the response
 * even when the layout shows a password box instead. Admin pages therefore
 * take their store from `adminStore()` in lib/plan/admin-data.ts, which
 * returns null when unauthenticated. Read the note in that file before adding
 * an admin route.
 */

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

/** Never prerendered or cached — the cookie decides what this returns. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  if (!(await isAdmin())) return <AdminLogin />;

  return (
    <>
      <AdminBar />

      {/*
        The one failure mode of a switch is forgetting which way it is set.
        Nothing else in the panel would mention that the public site is still a
        holding page, so this does.
      */}
      {!isSiteLive() && (
        <div className="border-accent/30 bg-accent-light text-accent-ink border-b print:hidden">
          <p className="container-page py-3 text-xs leading-relaxed">
            <strong>The public site is showing the holding page.</strong>{" "}
            Visitors cannot reach any page except this panel. To open the site,
            set <code>SITE_LIVE=true</code> in the hosting environment and
            redeploy.
          </p>
        </div>
      )}

      {children}
    </>
  );
}
