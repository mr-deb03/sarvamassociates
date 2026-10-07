import "server-only";

/* ==========================================================================
   In-memory rate limiting.

   Adequate for a single-host deployment, which is what this site is. It is
   per-process, so it does not hold across a restart or across instances behind
   a load balancer — if the site is ever scaled horizontally this needs to move
   to Redis or the platform's own limiter. It is a speed bump, not a lock; the
   real brute-force defence for the OTP is the attempt counter on the record.
   ========================================================================== */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Keeps the map from growing without bound on a long-lived process. */
function sweep(now: number): void {
  if (buckets.size < 5_000) return;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Milliseconds until the window resets. Only meaningful when blocked. */
  retryAfterMs: number;
}

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  bucket.count += 1;

  return bucket.count > max
    ? { allowed: false, retryAfterMs: bucket.resetAt - now }
    : { allowed: true, retryAfterMs: 0 };
}

/** Best-effort client address. Spoofable, so it limits abuse rather than access. */
export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
