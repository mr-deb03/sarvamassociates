import "server-only";
import { hashOtp, newOtpCode, otpMatches } from "./crypto";
import { maskPhone, OTP_TTL_MS, sendOtpSms } from "./sms";
import { getStore, type PlanRecord } from "./store";

/* ==========================================================================
   One-time passcode issue and verification.

   State lives on the plan record rather than in a separate table, because the
   two have exactly the same lifetime and there is never an OTP without a plan.

   The limits below are the whole of the brute-force defence, so they are
   deliberately tight: a six-digit code is one in a million, but five guesses a
   minute against an unlimited number of attempts is not a lock at all.
   ========================================================================== */

export const MAX_OTP_ATTEMPTS = 5;
export const MAX_RESENDS = 3;
export const RESEND_COOLDOWN_MS = 45_000;

export interface IssueResult {
  ok: boolean;
  /** Shown on screen in development only. See lib/plan/sms.ts. */
  devCode?: string;
  error?: string;
  /** Set when the caller is inside the resend cooldown. */
  retryAfterMs?: number;
}

export async function issueOtp(planId: string): Promise<IssueResult> {
  const store = getStore();
  const record = await store.get(planId);

  if (!record) return { ok: false, error: "That plan could not be found." };
  if (record.status === "verified") {
    return { ok: false, error: "This number is already verified." };
  }

  const now = Date.now();
  const existing = record.otp;

  if (existing) {
    if (existing.resendCount >= MAX_RESENDS) {
      return {
        ok: false,
        error:
          "We have sent the maximum number of codes for this plan. Please email us and we will send it across directly.",
      };
    }

    const since = now - existing.sentAt;
    if (since < RESEND_COOLDOWN_MS) {
      return {
        ok: false,
        error: "Please wait a few seconds before asking for another code.",
        retryAfterMs: RESEND_COOLDOWN_MS - since,
      };
    }
  }

  const code = newOtpCode();
  const sent = await sendOtpSms(record.input.phone, code);

  if (!sent.ok) {
    console.error(
      `[plan] OTP delivery failed for ${maskPhone(record.input.phone)}:`,
      sent.detail,
    );
    return {
      ok: false,
      error:
        "We could not send the code just now. Please try again in a moment, or email us and we will send your plan across directly.",
    };
  }

  await store.update(planId, (current) => ({
    ...current,
    otp: {
      hash: hashOtp(planId, code),
      expiresAt: now + OTP_TTL_MS,
      // A fresh code resets the guess counter; the resend counter is what
      // stops someone cycling codes to buy themselves unlimited attempts.
      attempts: 0,
      sentAt: now,
      resendCount: (current.otp?.resendCount ?? -1) + 1,
    },
  }));

  return { ok: true, devCode: sent.devCode };
}

export interface VerifyResult {
  ok: boolean;
  error?: string;
  record?: PlanRecord;
  /** Guesses left before the code is burned. */
  attemptsRemaining?: number;
}

export async function verifyOtp(
  planId: string,
  code: string,
): Promise<VerifyResult> {
  const store = getStore();
  const record = await store.get(planId);

  if (!record) return { ok: false, error: "That plan could not be found." };

  // Already through. Re-issuing access here rather than erroring means a
  // double-submit or a back-button does not strand someone.
  if (record.status === "verified") return { ok: true, record };

  const otp = record.otp;
  if (!otp) {
    return { ok: false, error: "Ask for a code first, then enter it here." };
  }

  if (Date.now() > otp.expiresAt) {
    return {
      ok: false,
      error: "That code has expired. Ask for a new one and try again.",
    };
  }

  if (otp.attempts >= MAX_OTP_ATTEMPTS) {
    return {
      ok: false,
      error:
        "Too many incorrect attempts. Ask for a new code to start again.",
      attemptsRemaining: 0,
    };
  }

  if (!otpMatches(planId, code, otp.hash)) {
    const updated = await store.update(planId, (current) => ({
      ...current,
      otp: current.otp
        ? { ...current.otp, attempts: current.otp.attempts + 1 }
        : null,
    }));

    const used = updated?.otp?.attempts ?? MAX_OTP_ATTEMPTS;
    const remaining = Math.max(0, MAX_OTP_ATTEMPTS - used);

    return {
      ok: false,
      error:
        remaining > 0
          ? `That code is not right. ${remaining} ${remaining === 1 ? "attempt" : "attempts"} left.`
          : "Too many incorrect attempts. Ask for a new code to start again.",
      attemptsRemaining: remaining,
    };
  }

  const verified = await store.update(planId, (current) => ({
    ...current,
    status: "verified" as const,
    verifiedAt: new Date().toISOString(),
    // The hash is cleared on success so a stored record never carries a live
    // credential once it has served its purpose.
    otp: null,
  }));

  return { ok: true, record: verified ?? record };
}
