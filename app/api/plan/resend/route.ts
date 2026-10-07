import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/plan/otp";
import { clientIp, rateLimit } from "@/lib/plan/rate-limit";
import { otpRequestSchema } from "@/lib/plan/schema";

/**
 * Re-send a verification code.
 *
 * Two limits apply: this per-IP window, and the per-record resend counter and
 * cooldown enforced inside issueOtp. The record-level one is what actually
 * caps the SMS bill, since it survives a changed IP address.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  const limit = rateLimit(`plan:resend:${ip}`, { max: 6, windowMs: 10 * 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const parsed = otpRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 422 });
  }

  const outcome = await issueOtp(parsed.data.planId);

  if (!outcome.ok) {
    return NextResponse.json(
      { ok: false, error: outcome.error, retryAfterMs: outcome.retryAfterMs },
      { status: 429 },
    );
  }

  return NextResponse.json({
    ok: true,
    ...(outcome.devCode ? { devCode: outcome.devCode } : {}),
  });
}
