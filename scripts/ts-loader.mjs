import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/* ==========================================================================
   Module resolution for running project TypeScript directly under Node.

   Node 22.6+ strips types from .ts files on its own, but it resolves them like
   any other ESM specifier: extensionless imports fail, and it knows nothing
   about the `@/*` alias in tsconfig.json. Both are everywhere in this codebase.

   This hook teaches it those two things so scripts/verify-plan-math.mjs can
   import lib/plan/calc.ts as written, with no build step and no dev
   dependency. It exists for the verification script only — nothing in the app
   loads through it.
   ========================================================================== */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WINDOWS_ABS = /^[a-zA-Z]:[\\/]/;

/** Extensions tried, in order, for a specifier that does not resolve as-is. */
const CANDIDATES = ["", ".ts", ".tsx", ".mts", "/index.ts"];

export async function resolve(specifier, context, next) {
  let spec = specifier;

  if (spec.startsWith("@/")) {
    spec = pathToFileURL(path.join(ROOT, spec.slice(2))).href;
  } else if (WINDOWS_ABS.test(spec)) {
    spec = pathToFileURL(spec).href;
  }

  let base = spec;
  if (spec.startsWith(".")) {
    const parent =
      context.parentURL && WINDOWS_ABS.test(context.parentURL)
        ? pathToFileURL(context.parentURL).href
        : context.parentURL;
    base = new URL(spec, parent).href;
  }

  if (base.startsWith("file:")) {
    for (const ext of CANDIDATES) {
      const candidate = base + ext;
      try {
        if (existsSync(fileURLToPath(candidate))) return next(candidate, context);
      } catch {
        // Not a resolvable filesystem path — fall through to the next
        // candidate, and finally to Node's own resolution.
      }
    }
  }

  return next(base, context);
}
