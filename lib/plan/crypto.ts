import "server-only";
import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

/* ==========================================================================
   Signing, hashing and token handling.

   Two things are protected here:

     - the OTP, which is stored as an HMAC rather than in the clear, so a
       leaked data directory does not hand over live codes;
     - the two session cookies (plan access, admin), which are signed payloads
       rather than opaque ids, so no server-side session table is needed.

   Everything hangs off one secret. There is no fallback in production: an
   unsigned or predictably-signed admin cookie is worse than a broken login.
   ========================================================================== */

let cachedSecret: string | null = null;

export function getSecret(): string {
  if (cachedSecret) return cachedSecret;

  const fromEnv = process.env.PLAN_SECRET;

  if (fromEnv && fromEnv.length >= 32) {
    cachedSecret = fromEnv;
    return cachedSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "PLAN_SECRET is missing or shorter than 32 characters. Generate one with " +
        "`node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"` " +
        "and set it before starting the server.",
    );
  }

  // Development only. Regenerated per process, so restarting `next dev`
  // invalidates open sessions — which is the right trade for never shipping a
  // hardcoded key.
  cachedSecret = randomBytes(32).toString("hex");
  console.warn(
    "[plan] PLAN_SECRET is not set — using a throwaway development key. " +
      "Sessions will not survive a restart.",
  );
  return cachedSecret;
}

const hmac = (value: string) =>
  createHmac("sha256", getSecret()).update(value).digest("base64url");

/** Length-safe comparison. Returns false rather than throwing on a mismatch. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/* ------------------------------------------------------------------- ids */

/** URL-safe, unguessable record id. */
export function newId(): string {
  return randomBytes(12).toString("base64url");
}

/* ------------------------------------------------------------------- OTP */

/** Six digits, uniformly distributed, leading zeros preserved. */
export function newOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/**
 * Codes are hashed with the record id mixed in, so the same six digits issued
 * for two different plans do not share a hash.
 */
export function hashOtp(planId: string, code: string): string {
  return hmac(`otp:${planId}:${code}`);
}

export function otpMatches(
  planId: string,
  code: string,
  storedHash: string,
): boolean {
  return safeEqual(hashOtp(planId, code), storedHash);
}

/* ---------------------------------------------------------------- tokens */

interface TokenPayload {
  /** What the bearer is allowed to do. */
  scope: "plan" | "admin";
  /** Plan id for a plan token; unused for admin. */
  subject: string;
  /** Expiry, epoch milliseconds. */
  exp: number;
}

/**
 * `<base64url(json)>.<signature>`.
 *
 * Deliberately not a JWT: there is no third party to interoperate with, and a
 * JWT library brings an algorithm-confusion surface for no gain here.
 */
export function signToken(payload: TokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmac(body)}`;
}

export function verifyToken(
  token: string | undefined,
  scope: TokenPayload["scope"],
): TokenPayload | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  if (!safeEqual(hmac(body), signature)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (payload.scope !== scope) return null;
  if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;

  return payload;
}

/* ------------------------------------------------------------ admin login */

/**
 * Compared against ADMIN_PASSWORD through an HMAC rather than directly, so the
 * comparison is both constant-time and length-blind — a direct timingSafeEqual
 * leaks the password length through the early return on mismatched buffers.
 */
export function adminPasswordMatches(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  return safeEqual(hmac(`admin:${submitted}`), hmac(`admin:${expected}`));
}

export const ADMIN_CONFIGURED = () => {
  const p = process.env.ADMIN_PASSWORD;
  return Boolean(p && p.length >= 8);
};
