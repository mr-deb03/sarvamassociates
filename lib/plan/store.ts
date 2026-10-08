import "server-only";
import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PlanResult } from "./calc";
import type { PlanData } from "./schema";
import { describeDatabase, selectDatabaseUrl } from "./store-config";

/* ==========================================================================
   Plan submission storage.

   `PlanStore` is the port; `fileStore` below is the adapter that ships. The
   admin panel and the route handlers only ever touch the interface, so moving
   to Postgres, Supabase or a CRM is one new adapter and one line in
   `getStore()` — no page and no route handler changes.

   WHY A FILE STORE BY DEFAULT

   It needs no credentials, no migration step and no second service, and the
   practice can open a submission in Notepad if it ever has to. For a single
   office taking tens of enquiries a month that is the right size of solution.

   WHAT IT WILL NOT SURVIVE

   A read-only or ephemeral filesystem. On Vercel, Netlify Functions, Cloud Run
   and similar, every deploy and every cold start discards this directory —
   `assertDurableStorage()` warns about exactly that at startup. On a VPS, a
   container with a mounted volume, or a plain `next start` on a server, it is
   durable and fine.

   THIS DIRECTORY HOLDS PERSONAL FINANCIAL DATA. It is excluded from git. Back
   it up, keep it off any public path, and restrict it to the service account.
   ========================================================================== */

export type PlanStatus = "pending-verification" | "verified";

export interface PlanOtpState {
  hash: string;
  expiresAt: number;
  /** Wrong codes entered so far. The record locks after MAX_OTP_ATTEMPTS. */
  attempts: number;
  sentAt: number;
  resendCount: number;
}

export interface PlanRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: PlanStatus;
  verifiedAt: string | null;

  /** Exactly what the visitor submitted, after validation. */
  input: PlanData;
  /** The computed plan, stored so the report never recalculates differently. */
  result: PlanResult;

  /** Lifted out of `input` so the admin list does not parse every record. */
  contact: {
    name: string;
    phone: string;
    email: string;
  };

  /** Request provenance, for abuse triage only. */
  meta: {
    ip: string | null;
    userAgent: string | null;
    referer: string | null;
  };

  otp: PlanOtpState | null;

  /** Free-text, written from the admin panel. Never shown to the visitor. */
  adminNotes?: string;
}

/** The shape the admin list needs — no financial detail, so it stays cheap. */
export interface PlanSummary {
  id: string;
  createdAt: string;
  status: PlanStatus;
  name: string;
  phone: string;
  email: string;
  goalCount: number;
  monthlyIncome: number;
  requiredMonthlyTotal: number;
}

export interface PlanStore {
  create(record: PlanRecord): Promise<void>;
  get(id: string): Promise<PlanRecord | null>;
  update(
    id: string,
    patch: (current: PlanRecord) => PlanRecord,
  ): Promise<PlanRecord | null>;
  list(): Promise<PlanSummary[]>;
  remove(id: string): Promise<boolean>;
}

/* ------------------------------------------------------------- file store */

/*
   Every fs call below carries a `turbopackIgnore` marker.

   The bundler sees a runtime-computed path and conservatively traces the whole
   project into the server output — every source file and the entire public
   folder — in case one of them turns out to be the target. None of them is:
   this directory holds records written after the build, and nothing in it
   exists at build time. The markers say so.
*/
const DATA_DIR = path.resolve(
  /* turbopackIgnore: true */ process.env.PLAN_DATA_DIR ??
    path.join(process.cwd(), ".data", "plans"),
);

/** Guards against a crafted id escaping the data directory. */
function recordPath(id: string): string {
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
    throw new Error("Refusing to touch a record path from an unexpected id");
  }
  return path.join(DATA_DIR, `${id}.json`);
}

async function ensureDir(): Promise<void> {
  await mkdir(/* turbopackIgnore: true */ DATA_DIR, { recursive: true });
}

/**
 * Write to a sibling temp file, then rename over the target.
 *
 * rename(2) is atomic within a filesystem, so a crash mid-write leaves the
 * previous record intact rather than a half-written JSON file that then fails
 * to parse forever.
 */
async function writeAtomic(target: string, contents: string): Promise<void> {
  const tmp = `${target}.${process.pid}.tmp`;
  await writeFile(/* turbopackIgnore: true */ tmp, contents, "utf8");
  await rename(/* turbopackIgnore: true */ tmp, target);
}

const fileStore: PlanStore = {
  async create(record) {
    await ensureDir();
    await writeAtomic(recordPath(record.id), JSON.stringify(record, null, 2));
  },

  async get(id) {
    try {
      const raw = await readFile(/* turbopackIgnore: true */ recordPath(id), "utf8");
      return JSON.parse(raw) as PlanRecord;
    } catch {
      return null;
    }
  },

  async update(id, patch) {
    const current = await this.get(id);
    if (!current) return null;

    const next = patch(current);
    next.updatedAt = new Date().toISOString();
    await writeAtomic(recordPath(id), JSON.stringify(next, null, 2));
    return next;
  },

  async list() {
    await ensureDir();

    let names: string[];
    try {
      names = await readdir(/* turbopackIgnore: true */ DATA_DIR);
    } catch {
      return [];
    }

    const records = await Promise.all(
      names
        .filter((n) => n.endsWith(".json"))
        .map(async (n) => {
          try {
            const raw = await readFile(
              path.join(/* turbopackIgnore: true */ DATA_DIR, n),
              "utf8",
            );
            return JSON.parse(raw) as PlanRecord;
          } catch {
            // A half-written or hand-edited file should not take the whole
            // admin list down with it.
            return null;
          }
        }),
    );

    return records
      .filter((r): r is PlanRecord => r !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toSummary);
  },

  async remove(id) {
    try {
      await unlink(/* turbopackIgnore: true */ recordPath(id));
      return true;
    } catch {
      return false;
    }
  },
};

export function toSummary(record: PlanRecord): PlanSummary {
  return {
    id: record.id,
    createdAt: record.createdAt,
    status: record.status,
    name: record.contact.name,
    phone: record.contact.phone,
    email: record.contact.email,
    goalCount: record.input.goals.length,
    monthlyIncome: record.result.cashflow.totalIncome,
    requiredMonthlyTotal: record.result.totals.requiredMonthlyTotal,
  };
}

/* ==========================================================================
   Choosing an adapter

   DATABASE_URL (or POSTGRES_URL) present -> Postgres. Absent -> the file store.

   That one rule covers every case without a flag to remember: a laptop with no
   database keeps working exactly as before, and a deployment that has one uses
   it. It is also the fix for the failure that took the first Vercel release
   down — process.cwd() there is /var/task, which is read-only, so the file
   store's mkdir throws EROFS on the first submission.

   `pg` is only imported when a connection string exists, so a file-store
   deployment never loads the driver.
   ========================================================================== */

export function databaseUrl(): string | null {
  return selectDatabaseUrl(process.env)?.url ?? null;
}

/** Logged once per process so a misconfigured deployment is visible early. */
let announced = false;
function announce(choice: ReturnType<typeof selectDatabaseUrl>): void {
  if (announced) return;
  announced = true;
  if (choice) {
    console.info(
      `[plan] submissions -> ${describeDatabase(choice.url)} (from ${choice.source})`,
    );
  }
}

let cached: PlanStore | null = null;

export async function getStore(): Promise<PlanStore> {
  if (cached) return cached;

  const choice = selectDatabaseUrl(process.env);
  announce(choice);

  if (choice) {
    const { createPostgresStore } = await import("./store-postgres");
    cached = createPostgresStore(choice.url);
  } else {
    cached = fileStore;
  }

  return cached;
}

/**
 * Turn a thrown store error into something worth printing.
 *
 * `error.message` is not enough on its own. Node raises an **AggregateError**
 * when a hostname resolves to several addresses and every connection fails —
 * "localhost" resolving to both ::1 and 127.0.0.1 is the everyday case — and
 * an AggregateError's own `message` is an EMPTY STRING. The real detail sits
 * in `.errors`.
 *
 * That is not a cosmetic problem. The admin page used `storeError ? ... : ...`
 * and an empty message is falsy, so a database that was refusing every
 * connection rendered the normal table with zero rows: "No plans have been
 * submitted yet." A practice would have read that as a quiet week rather than
 * an outage. Hence this function, and hence the `!== null` checks at the call
 * sites.
 */
export function describeStoreError(error: unknown): string {
  if (error instanceof AggregateError && error.errors.length > 0) {
    const inner = [
      ...new Set(error.errors.map(describeStoreError).filter(Boolean)),
    ];
    if (inner.length > 0) return inner.join("; ");
  }

  if (error instanceof Error) {
    const code = (error as NodeJS.ErrnoException).code;
    const message = error.message.trim();
    if (message && code) return `${message} (${code})`;
    if (message) return message;
    if (code) return `${error.name}: ${code}`;
    return error.name;
  }

  return String(error).trim() || "unknown error";
}

/** Which backend is in use, and where. Shown in the admin panel. */
export function storageLocation(): string {
  const url = databaseUrl();
  // describeDatabase never prints the password. The admin panel is behind a
  // login, but a connection string in a screenshot is one in the wild.
  return url ? describeDatabase(url) : `local files in ${DATA_DIR}`;
}

/**
 * Warns once, loudly, if the host looks like it will throw these records away.
 * Called from the submission route rather than at import time so it fires on a
 * real request, where the log will actually be read.
 */
let warned = false;
export function assertDurableStorage(): void {
  if (warned || process.env.NODE_ENV !== "production") return;
  if (databaseUrl()) return; // Postgres — durable by definition.
  warned = true;

  const ephemeral =
    process.env.VERCEL ??
    process.env.NETLIFY ??
    process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (ephemeral) {
    console.error(
      "[plan] No DATABASE_URL is set, so submissions are going to the local " +
        "filesystem — which this host does not keep, and may not even let us " +
        "write to. Expect EROFS on the first submission. Set DATABASE_URL to a " +
        "Postgres connection string this deployment can actually reach.",
    );
  }
}
