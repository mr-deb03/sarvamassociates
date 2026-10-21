/* ==========================================================================
   Whether the site is open to the public.

   A SWITCH, NOT A DATE.

   This started as a launch timestamp — hold for seven days, then open by
   itself. That was wrong in the way timers usually are: the date passed while
   the work was still going on, and the site let itself out. A deadline nobody
   is watching is not a decision, it is an accident waiting for a calendar.

   So the holding page now stays up for as long as it takes, and opening is
   something a person does once, on purpose.

   The default is HELD. An unset variable, a typo, a fresh environment, a
   forgotten setting on a new deployment — every one of those keeps the front
   door shut, which is the direction that cannot embarrass anybody.

   No `server-only` here: proxy.ts imports it, and that runs before the React
   runtime exists.
   ========================================================================== */

/**
 * Open the site by setting `SITE_LIVE=true` on the host, then redeploying.
 *
 * Trimmed and lower-cased first, so `true`, `TRUE` and ` True ` all open it —
 * a stray space or a capital letter in a dashboard field should not be the
 * difference between a live site and a holding page.
 *
 * Everything else keeps it held: `1`, `yes`, `on`, an empty value, or nothing
 * at all. Verified, not assumed. That is deliberately unforgiving — "is this
 * site public" should have one unambiguous answer, and a near-miss should
 * fail closed rather than guess.
 *
 * Deliberately NOT a NEXT_PUBLIC_ name. Those are substituted into the bundle
 * at build time; this is read from the environment on each request, and no
 * client code needs it.
 */
export function isSiteLive(): boolean {
  return process.env.SITE_LIVE?.trim().toLowerCase() === "true";
}

/** The holding page is up. */
export function isHeldBack(): boolean {
  return !isSiteLive();
}

/* ==========================================================================
   What stays reachable while the site is held back
   ========================================================================== */

/**
 * Paths the holding page never covers.
 *
 * The admin panel is on this list because enquiries do not stop arriving just
 * because the front door is shut, and the practice has to be able to read
 * them. The holding page itself is here for the obvious reason — rewriting it
 * to itself is a loop.
 */
export const OPEN_PREFIXES = ["/coming-soon", "/admin", "/api/admin"] as const;

export function isOpenPath(pathname: string): boolean {
  return OPEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Cookie set by a correct `?preview=` so the link only has to be used once. */
export const PREVIEW_COOKIE = "sa_preview";
export const PREVIEW_PARAM = "preview";
