import type { MetadataRoute } from "next";
import { isSiteLive } from "@/lib/launch";
import { SITE_URL } from "@/lib/seo";

/*
   Evaluated per request, not at build time.

   A statically generated robots.txt would freeze whichever answer was true
   when the build ran, and SITE_LIVE can change without this file changing.
   One tiny dynamic route is a fair price for the two never disagreeing.
*/
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  /*
     While the holding page is up, every URL returns the same thing. Letting
     that be crawled means the practice's own name turns up a page that says
     "opening soon" for as long as the index takes to refresh — long after it
     has opened. Better to be absent for a week than wrong for a month.
  */
  if (!isSiteLive()) {
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
