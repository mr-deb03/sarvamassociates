import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
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
