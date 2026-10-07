import { NextResponse } from "next/server";
import { grantPlanAccess } from "@/lib/plan/access";
import { verifyOtp } from "@/lib/plan/otp";
import { clientIp, rateLimit } from "@/lib/plan/rate-limit";
import { otpVerifySchema } from "@/lib/plan/schema";

/**
 * OTP check.
 *
 *   POST -> { ok: true }  + sets the sa_plan cookie
 *        -> { ok: false, error, attemptsRemaining? }
 *
 * The per-record attempt counter in lib/plan/otp.ts is the real lock. This IP
 * limit sits in front of it so one client cannot burn through the attempt
 * budget of many records at once.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  const limit = rateLimit(`plan:verify:${ip}`, { max: 20, windowMs: 10 * 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please wait a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not read that. Please try again." },
      { status: 400 },
    );
  }

  const parsed = otpVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Enter the 6-digit code we sent you." },
      { status: 422 },
    );
  }

  const outcome = await verifyOtp(parsed.data.planId, parsed.data.code);

  if (!outcome.ok) {
    return NextResponse.json(
      { ok: false, error: outcome.error, attemptsRemaining: outcome.attemptsRemaining },
      { status: 401 },
    );
  }

  await grantPlanAccess(parsed.data.planId);

  return NextResponse.json({ ok: true, planId: parsed.data.planId });
}
