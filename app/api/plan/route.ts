import { NextResponse } from "next/server";
import { computePlan } from "@/lib/plan/calc";
import { ALLOCATION_LABELS } from "@/lib/plan/catalog";
import { newId } from "@/lib/plan/crypto";
import { issueOtp } from "@/lib/plan/otp";
import { clientIp, rateLimit } from "@/lib/plan/rate-limit";
import { planSchema } from "@/lib/plan/schema";
import { assertDurableStorage, getStore } from "@/lib/plan/store";

/**
 * Financial plan submission.
 *
 *   POST -> { ok: true, planId, otpSent, devCode? }
 *        -> { ok: false, error, fieldErrors? }
 *
 * The record is written BEFORE the number is verified, deliberately. The
 * visitor has already pressed a button under a consent line that says the
 * details go to Sarvam Associates, so the submission is theirs and complete at
 * that moment; verification gates sight of the *result*, not the capture of
 * the enquiry. An abandoned verification therefore still reaches the practice,
 * flagged `pending-verification` so nobody mistakes it for a confirmed contact.
 */

export async function POST(request: Request) {
  const ip = clientIp(request);

  // Tighter than the consultation form: this writes a record and sends an SMS,
  // both of which cost something.
  const limit = rateLimit(`plan:create:${ip}`, { max: 4, windowMs: 10 * 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "That is a few too many plans in a short space of time. Please wait a little and try again.",
      },
      { status: 429, headers: { "Retry-After": retryAfterSeconds(limit.retryAfterMs) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not read that submission. Please try again." },
      { status: 400 },
    );
  }

  const parsed = planSchema.safeParse(body);

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

  const { company, ...plan } = parsed.data;

  // Honeypot. Hand back a well-formed success so the bot learns nothing, and
  // write nothing.
  if (company) {
    return NextResponse.json({ ok: true, planId: newId(), otpSent: true });
  }

  assertDurableStorage();

  const id = newId();
  const now = new Date();
  const result = computePlan(plan, ALLOCATION_LABELS, now);

  await getStore().create({
    id,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: "pending-verification",
    verifiedAt: null,
    input: plan,
    result,
    contact: { name: plan.name, phone: plan.phone, email: plan.email },
    meta: {
      ip,
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    },
    otp: null,
  });

  const otp = await issueOtp(id);

  return NextResponse.json({
    ok: true,
    planId: id,
    otpSent: otp.ok,
    // Only ever present outside production, and only when no real SMS provider
    // is configured. lib/plan/sms.ts refuses to populate it otherwise.
    ...(otp.devCode ? { devCode: otp.devCode } : {}),
    ...(otp.ok ? {} : { otpError: otp.error }),
  });
}

function retryAfterSeconds(ms: number): string {
  return String(Math.max(1, Math.ceil(ms / 1000)));
}
