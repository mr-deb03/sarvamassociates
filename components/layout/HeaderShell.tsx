"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-state wrapper for the header.
 *
 * Wraps rather than absorbs: the nav itself is server-rendered and passes
 * through as `children`, so only this short scroll listener reaches the client.
 *
 * Every hero on the site now sits on paper, so the header is dark-on-light in
 * both states — transparent at the top, then an paper veil with a hairline
 * once the page moves.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll(); // Correct on load and on back-navigation restore.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,border-color,backdrop-filter] duration-400",
        "ease-[var(--ease-editorial)]",
        scrolled
          ? "border-line/70 bg-paper/85 border-b backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {children}
    </header>
  );
}
