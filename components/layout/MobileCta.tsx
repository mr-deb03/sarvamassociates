"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky mobile CTA.
 *
 * Appears only after the hero has scrolled past, so it never covers the hero's
 * own buttons, and never on /contact where it would point at the page you are
 * already on.
 */
export function MobileCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact") return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pt-10 pb-4 lg:hidden",
        "from-paper via-paper/90 bg-gradient-to-t to-transparent",
        "transition-all duration-400 ease-[var(--ease-editorial)]",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <Link
        href="/contact"
        className="bg-navy text-paper rounded-pill flex h-13 items-center justify-center px-8 text-sm font-medium shadow-[var(--shadow-float)]"
      >
        Talk to an Advisor
      </Link>
    </div>
  );
}
