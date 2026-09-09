import type { Metadata } from "next";
import { COMPANY } from "./content/company";

/**
 * Canonical origin. Override per-environment with NEXT_PUBLIC_SITE_URL —
 * preview deployments must not emit canonicals pointing at production.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sarvamassociates.com";

export const SITE = {
  name: COMPANY.name,
  url: SITE_URL,
  locale: "en_IN",
  description:
    "Tax, compliance and wealth advisory in Bhandup West, Mumbai. 15+ years, 500+ investors. One advisor who sees your whole financial picture.",
} as const;

interface BuildMetadataArgs {
  title: string;
  description: string;
  /** Root-relative path, e.g. "/investments/pms". */
  path: string;
  noIndex?: boolean;
}

/**
 * Per-route metadata. Every page uses this so canonical, OpenGraph and Twitter
 * cards can never drift apart or be forgotten.
 */
export function buildMetadata({
  title,
  description,
  path,
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
