import { NextResponse, type NextRequest } from "next/server";
import {
  PREVIEW_COOKIE,
  PREVIEW_PARAM,
  isOpenPath,
  isSiteLive,
} from "@/lib/launch";

/* ==========================================================================
   The pre-launch gate.

   Runs before anything renders, so one file holds the whole site back and
   there is no page that can forget to check.

   (In Next 16 this file is `proxy.ts`. The old name, `middleware.ts`, is
   deprecated — same thing, renamed.)

   REWRITE, NOT REDIRECT. The URL the visitor typed stays in the bar and the
   response is a plain 200. A redirect would put /coming-soon in browser
   histories and proxy caches, and 301s in particular outlive the thing that
   caused them. Set SITE_LIVE=true and this function stops matching: every URL
   resolves to its real page, with nothing cached to undo.

   Three ways past it:
     - SITE_LIVE=true, which is the deliberate act of going public;
     - a correct ?preview= token, for showing the client beforehand;
     - an admin session, because whoever is reading submissions built this.
   ========================================================================== */

const PREVIEW_MAX_AGE = 60 * 60 * 24 * 14; // two weeks

export function proxy(request: NextRequest) {
  if (isSiteLive()) return NextResponse.next();

  const { pathname, searchParams } = request.nextUrl;

  if (isOpenPath(pathname)) return NextResponse.next();

  const token = process.env.PREVIEW_TOKEN?.trim();

  if (token) {
    // Arriving with the token: store it and bounce to the clean URL, so the
    // token is not left in the address bar to be copied or screenshotted.
    if (searchParams.get(PREVIEW_PARAM) === token) {
      const clean = new URL(request.nextUrl);
      clean.searchParams.delete(PREVIEW_PARAM);

      const response = NextResponse.redirect(clean);
      response.cookies.set(PREVIEW_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: PREVIEW_MAX_AGE,
      });
      return response;
    }

    if (request.cookies.get(PREVIEW_COOKIE)?.value === token) {
      return NextResponse.next();
    }
  }

  /*
     Presence of the admin cookie is enough here, without verifying its
     signature. That check needs node:crypto, which this runtime does not
     have, and the thing being protected is a launch date rather than data:
     the worst a forged cookie buys is an early look at a public website.
     Everything that actually matters re-verifies the signature properly in
     lib/plan/access.ts.
  */
  if (request.cookies.has("sa_admin")) return NextResponse.next();

  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  /*
     Everything except the build output, the image optimizer, and any path
     that ends in a file extension — which covers /robots.txt, /sitemap.xml
     and everything under /public. Those are cheap, harmless, and robots.txt
     in particular has to stay reachable so it can tell crawlers to wait.

     Matchers are read at build time and must be literals; a variable here is
     silently ignored.
  */
  matcher: ["/((?!_next/static|_next/image|.*\\.[^/]+$).*)"],
};
