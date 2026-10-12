"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useInsertionEffect } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/seo";

/**
 * Google Analytics 4 — the same property the WordPress site reported to, so
 * visitor counts carry on across the move.
 *
 * Two places are kept out of it, because their addresses name one client's
 * submission: the admin panel and an individual plan.
 *
 *   - A visit that STARTS on one never loads the tag at all.
 *   - A visit that ARRIVES at one by in-app navigation (the verification
 *     screen handing over to the plan) already has the tag running, so it is
 *     switched off with Google's opt-out flag and back on when the visitor
 *     leaves. Google documents that flag for page load, not for toggling, so
 *     treat this second case as best effort.
 *
 * Production only. Development and local builds would otherwise be counted as
 * visitors.
 */
const PRIVATE_PATH = /^\/(?:admin(?:\/|$)|financial-plan\/.)/;

export function Analytics() {
  const isPrivate = PRIVATE_PATH.test(usePathname());

  // An insertion effect rather than an ordinary one, so the flag changes in
  // the same commit as the route instead of a frame after it.
  useInsertionEffect(() => {
    (window as unknown as Record<string, boolean>)[
      `ga-disable-${GA_MEASUREMENT_ID}`
    ] = isPrivate;
  }, [isPrivate]);

  if (process.env.NODE_ENV !== "production" || isPrivate) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga-config">
        {"window.dataLayer=window.dataLayer||[];" +
          "function gtag(){dataLayer.push(arguments)}" +
          "gtag('js',new Date());" +
          `gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
