import "server-only";
import { isAdmin } from "./access";
import { getStore, type PlanStore } from "./store";

/* ==========================================================================
   Authorised data access.

   WHY THIS EXISTS, AND WHY ADMIN PAGES MUST NOT CALL getStore() DIRECTLY

   Checking the session in app/admin/layout.tsx is not enough, and the reason
   is easy to miss: a layout receives `children` as an element that has already
   been rendered. Next renders the page segment whether or not the layout ends
   up putting it on screen. A page that fetched submissions and handed them to
   a client component therefore serialised every name, mobile number and
   income figure into the flight payload of a page whose visible content was a
   password box. The HTML said "sign in"; the bytes underneath it held the
   data. That was a real leak, found by diffing a signed-out response.

   So the gate is here, on the data, instead of on the route. The return type
   is nullable, which means the authorisation check is not something a new page
   has to remember — it is something TypeScript will not let it skip.

   Returning null rather than calling notFound() or redirect() is deliberate:
   the layout is already rendering the sign-in form, so the page simply renders
   nothing beneath it.
   ========================================================================== */

export async function adminStore(): Promise<PlanStore | null> {
  return (await isAdmin()) ? getStore() : null;
}
