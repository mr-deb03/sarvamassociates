import "server-only";
import { cookies } from "next/headers";
import { signToken, verifyToken } from "./crypto";

/* ==========================================================================
   The two session cookies.

   `sa_plan` grants sight of one specific plan. `sa_admin` grants sight of all
   of them. Both are signed payloads rather than opaque ids, so neither needs a
   server-side session table — which matters because the record store is a
   directory of files, and a session table in that directory would be one more
   thing to expire and clean up.

   Both are httpOnly: no script on the page ever needs to read them, and a
   plan token readable from JavaScript is one XSS away from being exfiltrated.
   ========================================================================== */

const PLAN_COOKIE = "sa_plan";
const ADMIN_COOKIE = "sa_admin";

/**
 * A week. Long enough that someone can come back to their plan from the link
 * without re-verifying, short enough that a shared machine does not keep it
 * open indefinitely.
 */
const PLAN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** A working day. The admin panel shows personal financial data. */
const ADMIN_TTL_MS = 8 * 60 * 60 * 1000;

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/* ------------------------------------------------------------ plan access */

export async function grantPlanAccess(planId: string): Promise<void> {
  const jar = await cookies();
  jar.set(PLAN_COOKIE, signToken({
    scope: "plan",
    subject: planId,
    exp: Date.now() + PLAN_TTL_MS,
  }), { ...baseCookie, maxAge: PLAN_TTL_MS / 1000 });
}

/**
 * Whether the current request may see this plan.
 *
 * The plan id in the URL is unguessable on its own, but it is also the kind of
 * thing that ends up in a browser history, a chat message or a referrer
 * header. Requiring the cookie as well means a leaked link is not enough.
 */
export async function hasPlanAccess(planId: string): Promise<boolean> {
  const jar = await cookies();
  const payload = verifyToken(jar.get(PLAN_COOKIE)?.value, "plan");
  return payload?.subject === planId;
}

/* ---------------------------------------------------------------- admin */

export async function grantAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, signToken({
    scope: "admin",
    subject: "admin",
    exp: Date.now() + ADMIN_TTL_MS,
  }), {
    ...baseCookie,
    // Stricter than the plan cookie: nothing should ever navigate into the
    // admin panel from another site.
    sameSite: "strict",
    maxAge: ADMIN_TTL_MS / 1000,
  });
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value, "admin") !== null;
}

export async function revokeAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}
