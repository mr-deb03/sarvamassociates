"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_GROUPS, NAV_LINKS } from "@/lib/content/nav";
import { COMPANY } from "@/lib/content/company";

/**
 * Full-screen mobile navigation.
 *
 * Designed for mobile rather than compressed from desktop: groups expand
 * inline as sections instead of nested dropdowns, so nothing is more than one
 * tap deep, and the CTA sits at the bottom within thumb reach.
 *
 * The panel is PORTALLED TO document.body, and that is load-bearing rather
 * than tidiness. Once the page is scrolled, HeaderShell applies
 * `backdrop-blur-xl`, and an element with a backdrop-filter becomes the
 * containing block for every `position: fixed` descendant. With the panel
 * nested inside <header>, its `fixed inset-0` resolved against the 80px-tall
 * header instead of the viewport: the menu opened, but into an 80px strip, so
 * it read as "the menu stopped working after scrolling".
 *
 * Portalling also lifts the panel out of the header's z-50 stacking context,
 * so its z-100 competes against the page rather than against its siblings.
 *
 * No `mounted` guard is needed before touching `document`: the panel is only
 * rendered while `open`, and `open` can only become true from a click, which
 * is always client-side. Server and first client render agree on nothing.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on route change, adjusted during render rather than in an effect —
  // an effect would let the full-screen panel paint once over the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const { style } = document.body;
    const previous = style.overflow;
    style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    return () => {
      style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panel = (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="bg-paper fixed inset-0 z-100 overflow-y-auto outline-none xl:hidden"
    >
      <div className="border-line flex h-20 items-center justify-between border-b px-6">
        <span className="font-display text-navy text-display-sm">Menu</span>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
          aria-label="Close menu"
          className="text-navy -mr-2 p-2 transition-opacity hover:opacity-60"
        >
          <X aria-hidden strokeWidth={1.75} className="size-6" />
        </button>
      </div>

      <nav aria-label="Mobile" className="px-6 pt-10 pb-40">
        {NAV_GROUPS.map((group) => (
          <section key={group.label} className="mb-10">
            <Link
              href={group.href}
              className="text-eyebrow text-muted mb-4 flex items-center gap-3.5 uppercase"
            >
              <span aria-hidden className="accent-rule shrink-0" />
              {group.label}
            </Link>
            <ul className="border-line divide-line divide-y border-t">
              {group.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy flex items-center gap-2 py-4 text-base"
                    >
                      {link.label}
                      <ArrowUpRight
                        aria-hidden
                        strokeWidth={1.75}
                        className="text-muted size-4"
                      />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-navy block py-4 text-base"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mb-10">
          <ul className="border-line divide-line divide-y border-t">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-navy block py-4 text-base"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/contact"
          className="bg-navy text-paper rounded-pill flex h-14 items-center justify-center px-8 text-base font-medium"
        >
          Book a Consultation
        </Link>

        <p className="text-muted mt-8 text-center text-sm">
          <a href={`mailto:${COMPANY.email}`} className="link-underline">
            {COMPANY.email}
          </a>
        </p>
      </nav>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open menu"
        className="text-navy -mr-2 p-2 transition-opacity hover:opacity-60 xl:hidden"
      >
        <Menu aria-hidden strokeWidth={1.75} className="size-6" />
      </button>

      {/* Rendered into document.body, not here — see the note above. */}
      {open && createPortal(panel, document.body)}
    </>
  );
}
