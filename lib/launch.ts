/* ==========================================================================
   When the site opens.

   A FIXED MOMENT, not "seven days from deploy".

   There is no such thing as "when this was deployed" on a serverless host:
   every instance is cold, nothing persists between them, and a counter stored
   in memory restarts on each request. A launch date is the only definition of
   "seven days" that every instance agrees on.

   No `server-only` here: proxy.ts imports it, and that runs before the React
   runtime exists.
   ========================================================================== */

/**
 * Midnight IST on the day the site opens.
 *
 * Editable two ways. Change this constant, or set `LAUNCH_AT` on the host to
 * any value `Date.parse` understands — bring it forward to go live early,
 * push it back to hold longer. Keep the offset: without `+05:30` a bare date
 * is parsed as UTC and the site opens at 05:30 local.
 *
 * Deliberately NOT a NEXT_PUBLIC_ name. Those are substituted into the bundle
 * at build time, so the value would be frozen at whatever it was when the
 * build ran. This one is read from the environment on each request, and no
 * client code needs it — the countdown is handed the date as a prop.
 */
const DEFAULT_LAUNCH_AT = "2026-10-19T00:00:00+05:30";

export function launchAt(): number {
  const raw = process.env.LAUNCH_AT?.trim();
  if (raw) {
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) return parsed;
    // A typo here would silently open the site or hold it forever, so say so.
    console.warn(
      `[launch] LAUNCH_AT is not a date Date.parse understands: ${raw}. Falling back to ${DEFAULT_LAUNCH_AT}.`,
    );
  }
  return Date.parse(DEFAULT_LAUNCH_AT);
}

export function isBeforeLaunch(now: number = Date.now()): boolean {
  return now < launchAt();
}

/** ISO string, for passing the moment into a client component. */
export function launchAtIso(): string {
  return new Date(launchAt()).toISOString();
}

export function launchDateDisplay(): string {
  return new Date(launchAt()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
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
