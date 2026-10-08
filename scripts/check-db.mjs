#!/usr/bin/env node
/**
 * Database connectivity check.
 *
 * Answers the one question that matters before a deploy: can THIS machine
 * reach the database in DATABASE_URL, and is the table there?
 *
 * Run it locally to confirm your own Postgres, and — the part people skip —
 * remember that a pass here says nothing about whether Vercel can reach the
 * same address. A database on your own PC is not on the internet.
 *
 * Run: npm run check:db
 */

import { Client } from "pg";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!url) {
  console.log(
    "\nDATABASE_URL is not set.\n\n" +
      "  The planner will fall back to local JSON files in .data/plans, which is\n" +
      "  fine on a laptop or a server with a real disk, and does NOT work on\n" +
      "  Vercel, Netlify or Lambda — their filesystems are read-only.\n\n" +
      "  Set it in .env.local, for example:\n" +
      "    DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/sarvam\n",
  );
  process.exit(0);
}

/** Never print the password, not even to a local terminal. */
const safe = (() => {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.username ? `${u.username}:***@` : ""}${u.host}${u.pathname}`;
  } catch {
    return "(unparseable connection string)";
  }
})();

console.log(`\nChecking ${safe}\n`);

const isLocal = /^(localhost|127\.0\.0\.1|\[?::1\]?)$/.test(
  (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  })(),
);

const client = new Client({
  connectionString: url,
  ssl: isLocal
    ? false
    : process.env.DATABASE_SSL_NO_VERIFY === "true"
      ? { rejectUnauthorized: false }
      : { rejectUnauthorized: true },
  connectionTimeoutMillis: 8000,
});

try {
  await client.connect();

  const version = await client.query("SELECT version()");
  console.log(`  connected   ${version.rows[0].version.split(",")[0]}`);

  await client.query(`
    CREATE TABLE IF NOT EXISTS plan_submissions (
      id          text PRIMARY KEY,
      created_at  timestamptz NOT NULL,
      updated_at  timestamptz NOT NULL,
      status      text        NOT NULL,
      name        text        NOT NULL,
      phone       text        NOT NULL,
      email       text        NOT NULL,
      record      jsonb       NOT NULL
    );
    CREATE INDEX IF NOT EXISTS plan_submissions_created_at_idx
      ON plan_submissions (created_at DESC);
    CREATE INDEX IF NOT EXISTS plan_submissions_status_idx
      ON plan_submissions (status);
  `);
  console.log("  table       plan_submissions is present");

  const counts = await client.query(`
    SELECT count(*)::int AS total,
           count(*) FILTER (WHERE status = 'verified')::int AS verified
      FROM plan_submissions
  `);
  const { total, verified } = counts.rows[0];
  console.log(`  rows        ${total} submission(s), ${verified} verified`);

  if (isLocal) {
    console.log(
      "\n  NOTE: this is a database on this machine. A deployment on Vercel or\n" +
        "  any other cloud host CANNOT reach it — localhost there means their\n" +
        "  server, not yours. See the README section on hosting.",
    );
  }

  console.log("\n✓ database check passed\n");
  await client.end();
  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n✗ could not use that database\n\n  ${message}\n`);

  const hint = {
    ECONNREFUSED:
      "Nothing is listening on that host and port. Is Postgres running, and is the port right?",
    ENOTFOUND: "That hostname does not resolve. Check the host in the connection string.",
    ETIMEDOUT:
      "The connection timed out — usually a firewall, or a host that is not reachable from here.",
    "28P01": "Wrong username or password.",
    "3D000": "That database does not exist yet. Create it first: CREATE DATABASE sarvam;",
    "28000": "The server rejected this user — check pg_hba.conf for the host you are connecting from.",
  }[error?.code];

  if (hint) console.error(`  ${hint}\n`);

  if (/self[- ]signed|certificate/i.test(message)) {
    console.error(
      "  The certificate could not be verified. If this server uses a self-signed\n" +
        "  certificate and you accept the risk, set DATABASE_SSL_NO_VERIFY=true.\n",
    );
  }

  await client.end().catch(() => {});
  process.exit(1);
}
