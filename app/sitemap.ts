import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/content/categories";
import { ALL_PRODUCT_SLUGS } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/investments", priority: 0.9 },
    { path: "/financial-solutions", priority: 0.9 },
    { path: "/how-it-works", priority: 0.7 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/faq", priority: 0.6 },
    { path: "/calculators", priority: 0.5 },
    { path: "/disclaimer", priority: 0.4 },
    { path: "/privacy-policy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),

    ...CATEGORIES.filter((c) => c.domain === "investment").map((c) => ({
      url: `${SITE_URL}/investments/${c.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    ...ALL_PRODUCT_SLUGS.map((slug) => ({
      url: `${SITE_URL}/products/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
