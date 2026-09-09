#!/usr/bin/env node
/**
 * Compliance claim guard.
 *
 * Scans user-facing source for wording that must never appear on a financial
 * marketing site (brief §42, §47). This is a regression guard: the corrections
 * documented in lib/content/products.ts and homepage.ts are easy to undo by
 * accident during a copy edit, and this catches that before it ships.
 *
 * Run: npm run check:claims  (also part of `npm run check`)
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib"];

/**
 * Files permitted to contain a banned phrase, because their entire purpose is
 * to name or negate it.
 */
const ALLOWLIST = new Set(
  [
    "lib/content/disclaimers.ts",
    "lib/content/products.ts",
    "lib/content/homepage.ts",
    "lib/content/faqs.ts",
    "app/disclaimer/page.tsx",
    "app/terms/page.tsx",
    "app/calculators/page.tsx",
    "scripts/check-claims.mjs",
  ].map((p) => p.split("/").join(sep)),
);

const BANNED = [
  { pattern: /\bguaranteed\s+returns?\b/i, why: "asserts an assured return" },
  { pattern: /\bassured\s+returns?\b/i, why: "asserts an assured return" },
  { pattern: /\brisk[-\s]free\b/i, why: "no market-linked product is risk-free" },
  { pattern: /\b100%\s+safe\b/i, why: "absolute safety claim" },
  { pattern: /\bdouble\s+your\s+money\b/i, why: "return promise" },
  { pattern: /\bno\s+risk\b/i, why: "absolute risk claim" },
  { pattern: /\bwithout\s+the\s+risk\b/i, why: "absolute risk claim" },
  {
    pattern: /\bsebi[-\s]registered\s+investment\s+advis[eo]r\b/i,
    why: "Sarvam operates as an AMFI-registered distributor, not an RIA",
  },
  {
    pattern: /\binstant\s+(disbursement|approval|sanction)\b/i,
    why: "sanction and disbursement are at the lender's discretion",
  },
  {
    pattern: /\bcapital\s+guarantee(d)?\b/i,
    why: "protection features depend on issuer credit; they are not guarantees",
  },
];

/**
 * Blank out comments so the guard scans user-facing strings only.
 *
 * Without this, every code comment documenting *why* a phrase was removed
 * trips the very rule it explains. Returns an array the same length as the
 * input so reported line numbers stay accurate.
 */
function stripComments(lines) {
  let inBlock = false;

  return lines.map((line) => {
    let out = line;

    if (inBlock) {
      const end = out.indexOf("*/");
      if (end === -1) return "";
      out = out.slice(end + 2);
      inBlock = false;
    }

    // Remove any complete /* ... */ spans on this line.
    out = out.replace(/\/\*[\s\S]*?\*\//g, " ");

    const blockStart = out.indexOf("/*");
    if (blockStart !== -1) {
      inBlock = true;
      out = out.slice(0, blockStart);
    }

    // Line comments. Naive on purpose — a "//" inside a URL string only ever
    // causes the guard to scan less of a line, never to miss a whole file.
    const lineStart = out.indexOf("//");
    if (lineStart !== -1) out = out.slice(0, lineStart);

    return out;
  });
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (/\.(tsx?|mjs)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const findings = [];

for (const dir of SCAN_DIRS) {
  const abs = join(ROOT, dir);
  let files;
  try {
    files = walk(abs);
  } catch {
    continue;
  }

  for (const file of files) {
    const rel = relative(ROOT, file);
    if (ALLOWLIST.has(rel)) continue;

    const raw = readFileSync(file, "utf8").split(/\r?\n/);
    const lines = stripComments(raw);

    lines.forEach((line, i) => {
      for (const { pattern, why } of BANNED) {
        if (pattern.test(line)) {
          findings.push({
            file: rel.split(sep).join("/"),
            line: i + 1,
            text: (raw[i] ?? line).trim().slice(0, 110),
            why,
          });
        }
      }
    });
  }
}

if (findings.length === 0) {
  console.log("✓ claim guard: no prohibited wording found");
  process.exit(0);
}

console.error(`\n✗ claim guard: ${findings.length} prohibited phrase(s) found\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}`);
  console.error(`    ${f.text}`);
  console.error(`    → ${f.why}\n`);
}
console.error(
  "If this wording is genuinely required and legally supported, add the file\n" +
    "to ALLOWLIST in scripts/check-claims.mjs with a comment explaining why.\n",
);
process.exit(1);
