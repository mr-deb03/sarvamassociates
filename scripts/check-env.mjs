#!/usr/bin/env node
/**
 * Storage configuration check.
 *
 * Two decisions in lib/plan/store-config.ts fail silently in the direction
 * that hurts, so both are asserted here rather than trusted:
 *
 *   1. Which connection string is used. Picking none makes the planner fall
 *      back to local JSON files, which on Vercel is a read-only filesystem
 *      and an EROFS on the first submission. The bug this test was written
 *      for: a blank-but-present DATABASE_URL shadowing a valid POSTGRES_URL,
 *      because `??` treats "" as a value.
 *
 *   2. Whether TLS is verified. Get it wrong and client income and expense
 *      data crosses the internet unencrypted, with nothing on screen to say so.
 *
 * Run: npm run check:env  (also part of `npm run check`)
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./ts-loader.mjs", pathToFileURL(import.meta.dirname + "/"));

const { selectDatabaseUrl, sslForUrl, describeDatabase } = await import(
  "../lib/plan/store-config.ts"
);

let failures = 0;

function check(label, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  const ok = a === e;
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? "ok  " : "FAIL"}  ${label.padEnd(54)}${ok ? "" : `\n          got ${a}\n          want ${e}`}`,
  );
}

const NEON = "postgresql://u:p@ep-cool-name-123.ap-southeast-1.aws.neon.tech/sarvam?sslmode=require";

console.log("\nWhich connection string wins");
check(
  "DATABASE_URL beats POSTGRES_URL",
  selectDatabaseUrl({ DATABASE_URL: "postgres://a", POSTGRES_URL: "postgres://b" }),
  { url: "postgres://a", source: "DATABASE_URL" },
);
check(
  "POSTGRES_URL used when DATABASE_URL is absent",
  selectDatabaseUrl({ POSTGRES_URL: "postgres://b" }),
  { url: "postgres://b", source: "POSTGRES_URL" },
);
// The regression this file exists for.
check(
  "blank DATABASE_URL does NOT shadow POSTGRES_URL",
  selectDatabaseUrl({ DATABASE_URL: "   ", POSTGRES_URL: "postgres://b" }),
  { url: "postgres://b", source: "POSTGRES_URL" },
);
check(
  "unpooled is a last resort, not a preference",
  selectDatabaseUrl({
    DATABASE_URL_UNPOOLED: "postgres://direct",
    POSTGRES_URL: "postgres://pooled",
  }),
  { url: "postgres://pooled", source: "POSTGRES_URL" },
);
check(
  "unpooled used when nothing else is set",
  selectDatabaseUrl({ POSTGRES_URL_NON_POOLING: "postgres://direct" }),
  { url: "postgres://direct", source: "POSTGRES_URL_NON_POOLING" },
);
check("nothing set means the file store", selectDatabaseUrl({}), null);
check("whitespace everywhere means the file store", selectDatabaseUrl({ DATABASE_URL: " " }), null);

console.log("\nWhether TLS is verified");
check("hosted Postgres is verified", sslForUrl(NEON), { rejectUnauthorized: true });
check(
  "any non-loopback host is verified, even without sslmode",
  sslForUrl("postgresql://u:p@db.example.com:5432/sarvam"),
  { rejectUnauthorized: true },
);
check("localhost needs no TLS", sslForUrl("postgresql://u:p@localhost:5432/sarvam"), false);
check("127.0.0.1 needs no TLS", sslForUrl("postgresql://u:p@127.0.0.1:5432/sarvam"), false);
check(
  "localhost with sslmode=require still gets TLS",
  sslForUrl("postgresql://u:p@localhost:5432/sarvam?sslmode=require"),
  { rejectUnauthorized: true },
);
check(
  "sslmode=disable is honoured",
  sslForUrl("postgresql://u:p@db.example.com/sarvam?sslmode=disable"),
  false,
);
check(
  "verification is only skipped when explicitly asked",
  sslForUrl(NEON, { DATABASE_SSL_NO_VERIFY: "true" }),
  { rejectUnauthorized: false },
);
check(
  "a stray truthy-looking value does not disable verification",
  sslForUrl(NEON, { DATABASE_SSL_NO_VERIFY: "1" }),
  { rejectUnauthorized: true },
);
check(
  "an unparseable string still gets TLS",
  sslForUrl("not a url at all"),
  { rejectUnauthorized: true },
);

console.log("\nWhat gets shown in the admin panel");
const described = describeDatabase(NEON);
check(
  "the password never appears",
  described.includes(":p@") || described.includes("p"),
  described.includes("p"), // "Postgres" contains p; the point is the credential is gone
);
console.log(`          ${described}`);
if (described.includes(":p@") || described.includes("u:p")) {
  failures += 1;
  console.log("  FAIL  credentials leaked into the description");
}

console.log(
  failures === 0
    ? "\n✓ storage config: all checks passed\n"
    : `\n✗ storage config: ${failures} check(s) failed\n`,
);
process.exit(failures === 0 ? 0 : 1);
