import { NextResponse } from "next/server";
import { consultationSchema } from "@/lib/forms/consultation-schema";
import { deliverLead } from "@/lib/forms/deliver";

/**
 * Consultation lead endpoint.
 *
 * Contract:
 *   POST -> { ok: true }
 *        -> { ok: false, error: string, fieldErrors?: Record<string, string[]> }
 *
 * The client already validated with the same schema; this re-validates because
 * a client-side check is a convenience, never a control.
 */

/** Naive per-IP rate limit. Adequate for a marketing form on a single host. */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "That's a few too many submissions. Please wait a minute and try again.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't read that submission. Please try again." },
      { status: 400 },
    );
  }

  const parsed = consultationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some details need checking.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Honeypot: a bot filled a field no human can see. Return success so the bot
  // does not learn it was caught, but deliver nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const result = await deliverLead(parsed.data);

  if (!result.ok) {
    // Log the real cause; never expose it to the browser (brief §53).
    console.error("[consultation] delivery failed:", result.detail);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't submit that just now. Please try again, or email us directly at info@sarvamassociates.com.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
