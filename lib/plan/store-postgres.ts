import "server-only";
import { Pool, type PoolClient } from "pg";
import { sslForUrl } from "./store-config";
import type { PlanRecord, PlanStore, PlanSummary } from "./store";

/* ==========================================================================
   Postgres adapter.

   Plain `pg` against a plain connection string, so the same code runs against
   Postgres on a laptop, on a VPS, or on Neon / Supabase / Railway. Nothing
   here is vendor-specific: moving between them is a change of DATABASE_URL.

   SHAPE

   One row per submission. The whole record lives in a `jsonb` column, exactly
   as the file store wrote it to disk, with the handful of fields the admin
   list needs lifted into real columns beside it. That keeps the record format
   identical across both adapters — a plan exported from one opens in the other
   — while the list view stays a single indexed query instead of reading every
   submission to show a table of names.

   The table is created on first use. A plan form is not worth a migration
   step, and `CREATE TABLE IF NOT EXISTS` is idempotent, so a fresh database
   and a redeploy both just work.
   ========================================================================== */

const TABLE = "plan_submissions";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getPool(url: string): Pool {
  if (pool) return pool;

  pool = new Pool({
    connectionString: url,
    ssl: sslForUrl(url, process.env),
    // Serverless runs many short-lived instances, each with its own pool, so a
    // large per-instance pool is how a small database runs out of connections.
    max: Number(process.env.DATABASE_POOL_MAX ?? 3),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  // A pool that emits an unhandled 'error' takes the process down with it.
  pool.on("error", (error) => {
    console.error("[plan] idle postgres client errored:", error);
  });

  return pool;
}

async function ensureSchema(url: string): Promise<void> {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    await getPool(url).query(`
      CREATE TABLE IF NOT EXISTS ${TABLE} (
        id          text PRIMARY KEY,
        created_at  timestamptz NOT NULL,
        updated_at  timestamptz NOT NULL,
        status      text        NOT NULL,
        name        text        NOT NULL,
        phone       text        NOT NULL,
        email       text        NOT NULL,
        record      jsonb       NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ${TABLE}_created_at_idx
        ON ${TABLE} (created_at DESC);
      CREATE INDEX IF NOT EXISTS ${TABLE}_status_idx
        ON ${TABLE} (status);
    `);
  })();

  try {
    await schemaReady;
  } catch (error) {
    // Let the next request try again rather than caching a rejected promise
    // forever — a database that was briefly unreachable should recover.
    schemaReady = null;
    throw error;
  }

  return schemaReady;
}

/* ------------------------------------------------------------------ store */

export function createPostgresStore(url: string): PlanStore {
  const query = async <T extends Record<string, unknown>>(
    text: string,
    values: unknown[] = [],
  ) => {
    await ensureSchema(url);
    return getPool(url).query<T>(text, values);
  };

  return {
    async create(record) {
      await query(
        `INSERT INTO ${TABLE}
           (id, created_at, updated_at, status, name, phone, email, record)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          record.id,
          record.createdAt,
          record.updatedAt,
          record.status,
          record.contact.name,
          record.contact.phone,
          record.contact.email,
          JSON.stringify(record),
        ],
      );
    },

    async get(id) {
      const result = await query<{ record: PlanRecord }>(
        `SELECT record FROM ${TABLE} WHERE id = $1`,
        [id],
      );
      return result.rows[0]?.record ?? null;
    },

    /**
     * Read-modify-write inside a transaction, with the row locked.
     *
     * This matters: the OTP attempt counter lives on the record, and two
     * submissions of a wrong code arriving together would otherwise each read
     * the same count and write back the same increment — handing an attacker a
     * free guess every time they double-submit. `FOR UPDATE` serialises them.
     * The file adapter cannot do this, which is one more reason Postgres is
     * the better home for these rows.
     */
    async update(id, patch) {
      await ensureSchema(url);

      const client: PoolClient = await getPool(url).connect();
      try {
        await client.query("BEGIN");

        const current = await client.query<{ record: PlanRecord }>(
          `SELECT record FROM ${TABLE} WHERE id = $1 FOR UPDATE`,
          [id],
        );

        const existing = current.rows[0]?.record;
        if (!existing) {
          await client.query("ROLLBACK");
          return null;
        }

        const next = patch(existing);
        next.updatedAt = new Date().toISOString();

        await client.query(
          `UPDATE ${TABLE}
              SET updated_at = $2,
                  status     = $3,
                  name       = $4,
                  phone      = $5,
                  email      = $6,
                  record     = $7
            WHERE id = $1`,
          [
            id,
            next.updatedAt,
            next.status,
            next.contact.name,
            next.contact.phone,
            next.contact.email,
            JSON.stringify(next),
          ],
        );

        await client.query("COMMIT");
        return next;
      } catch (error) {
        await client.query("ROLLBACK").catch(() => {});
        throw error;
      } finally {
        client.release();
      }
    },

    /**
     * The three derived figures are pulled straight out of the jsonb rather
     * than by loading every record and summing in JavaScript, so the admin
     * list stays one query no matter how many submissions accumulate.
     */
    async list() {
      const result = await query<{
        id: string;
        created_at: Date;
        status: PlanSummary["status"];
        name: string;
        phone: string;
        email: string;
        goal_count: string | null;
        monthly_income: string | null;
        required_monthly: string | null;
      }>(`
        SELECT id, created_at, status, name, phone, email,
               jsonb_array_length(record->'input'->'goals')            AS goal_count,
               record->'result'->'cashflow'->>'totalIncome'            AS monthly_income,
               record->'result'->'totals'->>'requiredMonthlyTotal'     AS required_monthly
          FROM ${TABLE}
         ORDER BY created_at DESC
         LIMIT 2000
      `);

      return result.rows.map((row) => ({
        id: row.id,
        createdAt: new Date(row.created_at).toISOString(),
        status: row.status,
        name: row.name,
        phone: row.phone,
        email: row.email,
        goalCount: Number(row.goal_count ?? 0),
        monthlyIncome: Number(row.monthly_income ?? 0),
        requiredMonthlyTotal: Number(row.required_monthly ?? 0),
      }));
    },

    async remove(id) {
      const result = await query(`DELETE FROM ${TABLE} WHERE id = $1`, [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}
