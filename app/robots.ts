import type { MetadataRoute } from "next";
import { isBeforeLaunch } from "@/lib/launch";
import { SITE_URL } from "@/lib/seo";

/*
   Evaluated per request, not at build time.

   A statically generated robots.txt would freeze whichever answer was true
   when the build ran: hold the site back and it would keep telling crawlers
   to stay away long after launch, with nothing but a rebuild to clear it.
   One tiny dynamic route is a fair price for that not happening.
*/
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  /*
     While the holding page is up, every URL returns the same thing. Letting
     that be crawled means the practice's own name turns up a page that says
     "opening soon" for as long as the index takes to refresh — long after it
     has opened. Better to be absent for a week than wrong for a month.
  */
  if (isBeforeLaunch()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /financial-plan itself is a public page and stays indexable; the
      // generated plans beneath it hold personal financial data and must not
      // be crawled. The admin panel is behind a session cookie regardless, but
      // there is no reason for it to appear in a crawl queue at all.
      disallow: ["/api/", "/admin", "/financial-plan/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
