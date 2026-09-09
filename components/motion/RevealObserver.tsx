"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every [data-reveal] on the page.
 *
 * Mounted once in the root layout. Re-scans on route change (the effect reruns
 * because the layout remounts children), and observes anything added later via
 * a MutationObserver, so client-rendered lists reveal correctly too.
 *
 * Elements already in view on load are revealed immediately, which keeps the
 * first paint from animating content the user is already looking at.
 */
export function RevealObserver() {
  useEffect(() => {
    // Tells the layout's failsafe timer that reveals are being handled, so it
    // does not fall back to showing everything.
    document.documentElement.setAttribute("data-reveal-ready", "");

    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    // If the browser cannot observe, show everything rather than hide it.
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // A little slack at the bottom so a section is revealed just before it
      // is fully in view, rather than visibly popping in.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll?.("[data-reveal]:not([data-revealed])").forEach(
        (el) => observer.observe(el),
      );
    };

    observeAll(document);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const el = node as Element;
          if (el.matches("[data-reveal]:not([data-revealed])")) {
            observer.observe(el);
          }
          observeAll(el);
        }
      }
    });

    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
