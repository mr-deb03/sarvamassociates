import { NextResponse } from "next/server";
import { grantAdminSession, revokeAdminSession } from "@/lib/plan/access";
import { ADMIN_CONFIGURED, adminPasswordMatches } from "@/lib/plan/crypto";
import { clientIp, rateLimit } from "@/lib/plan/rate-limit";

/**
 * Admin sign in and out.
 *
 * A single shared password, which is the right weight for one office with two
 * or three people in it. It is not the right weight for a team that needs to
 * know who looked at what — if that day comes, this is the file that grows an
 * identity provider, and nothing else changes.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  // Deliberately severe. There is one password and no account to lock out, so
  // the window is the only thing standing between a guesser and the data.
  const limit = rateLimit(`admin:login:${ip}`, { max: 5, windowMs: 15 * 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  if (!ADMIN_CONFIGURED()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The admin panel is not set up yet. Set ADMIN_PASSWORD (at least 8 characters) and restart the server.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const password = (body as { password?: unknown })?.password;

  if (typeof password !== "string" || !adminPasswordMatches(password)) {
    // One message for both a missing and a wrong password: nothing here should
    // help someone work out which half they got right.
    return NextResponse.json(
      { ok: false, error: "That password is not right." },
      { status: 401 },
    );
  }

  await grantAdminSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await revokeAdminSession();
  return NextResponse.json({ ok: true });
}
