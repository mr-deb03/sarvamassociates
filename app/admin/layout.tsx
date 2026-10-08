import type { Metadata } from "next";
import { AdminBar } from "@/components/admin/AdminBar";
import { AdminLogin } from "@/components/admin/AdminLogin";
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
      {children}
    </>
  );
}
