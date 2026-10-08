/* ==========================================================================
   Which database, and how to reach it.

   Two decisions live here, both pure and both tested by
   scripts/check-env.mjs, because each fails SILENTLY in the direction that
   hurts:

     - pick no connection string and the planner falls back to local files,
       which on a serverless host means EROFS on the first submission;
     - get the TLS decision wrong and client financial data crosses the
       internet unencrypted, with nothing on screen to say so.

   Neither module that uses these imports `server-only`, so a plain Node
   script can exercise them without a bundler.
   ========================================================================== */

/**
 * Connection string candidates, in priority order.
 *
 * Vercel's Neon integration injects all of these. The POOLED ones come first
 * on purpose: serverless opens and drops connections constantly, and pointing
 * many short-lived instances at a direct endpoint is how a small database runs
 * out of connections. The unpooled names are a last resort — if both pooled
 * vars are empty something is already misconfigured, and a working site beats
 * a correct one that is down.
 */
export const DATABASE_URL_VARS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
] as const;

export interface DatabaseChoice {
  url: string;
  /** Which variable it came from. Logged once, so misconfiguration is visible. */
  source: (typeof DATABASE_URL_VARS)[number];
}

/**
 * First NON-EMPTY candidate wins.
 *
 * "First defined" is the obvious implementation and the wrong one: `??` treats
 * an empty string as a value, so a `DATABASE_URL` created in a dashboard and
 * left blank shadows a perfectly good `POSTGRES_URL` beside it. The planner
 * then quietly uses local files. On Vercel that is a read-only filesystem and
 * every submission fails.
 */
export function selectDatabaseUrl(
  env: Record<string, string | undefined>,
): DatabaseChoice | null {
  for (const name of DATABASE_URL_VARS) {
    const value = env[name]?.trim();
    if (value) return { url: value, source: name };
  }
  return null;
}

export type SslChoice = false | { rejectUnauthorized: boolean };

/**
 * TLS policy for a connection string.
 *
 * Verified by default, because these rows hold someone's income, expenses and
 * goals and the connection may well cross the public internet. Hosted Postgres
 * — Neon, Supabase, Railway — all present publicly trusted certificates, so
 * verification simply works.
 *
 * A loopback address is exempt: the traffic never leaves the machine, and
 * requiring TLS there would only teach people to switch verification off.
 *
 * `DATABASE_SSL_NO_VERIFY` is the escape hatch for a self-signed certificate.
 * It keeps the traffic encrypted but stops authenticating the server, so it is
 * deliberately something somebody has to set, never a fallback.
 */
export function sslForUrl(
  url: string,
  env: Record<string, string | undefined> = {},
): SslChoice {
  if (/[?&]sslmode=disable\b/.test(url)) return false;

  // null means the string could not be parsed at all, which is NOT the same as
  // a parseable string with an empty hostname. Conflating the two turned a
  // typo in a connection string into a silently unencrypted connection: the
  // empty-host case read as "loopback" and switched TLS off. An unparseable
  // string now takes the safe path.
  let host: string | null = null;
  try {
    host = new URL(url).hostname;
  } catch {
    host = null;
  }

  const loopback =
    host !== null &&
    (host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host === "[::1]" ||
      // postgres:///sarvam — no host given, so the driver uses a local socket.
      host === "");

  if (loopback && !/[?&]sslmode=require\b/.test(url)) return false;

  if (env.DATABASE_SSL_NO_VERIFY === "true") return { rejectUnauthorized: false };

  return { rejectUnauthorized: true };
}

/** Host and database only — never the password. Shown in the admin panel. */
export function describeDatabase(url: string): string {
  try {
    const parsed = new URL(url);
    const port = parsed.port ? `:${parsed.port}` : "";
    return `Postgres at ${parsed.hostname}${port}${parsed.pathname}`;
  } catch {
    return "Postgres";
  }
}
