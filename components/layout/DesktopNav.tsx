"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { NAV_GROUPS, NAV_LINKS } from "@/lib/content/nav";
import { cn } from "@/lib/utils";

/**
 * Desktop navigation with accessible dropdowns.
 *
 * Pointer devices open on hover; keyboard and touch open on click. Escape
 * closes and returns focus to the trigger. A pointerdown outside closes.
 *
 * The active-route indicator is the one nav element allowed accent — it is
 * a single hairline, which is exactly the "small accent line / active state"
 * the accent is reserved for.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on route change, adjusted during render rather than in an effect —
  // an effect would let the panel paint once over the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const isActive = (href: string) => {
    // "/#services" splits to "/", and every path startsWith "/" — which
    // marked that item active on every page. Hash links into the homepage
    // are only active when you are actually on the homepage.
    const path = href.split("#")[0] || "/";
    if (path === "/") return pathname === "/" && href.includes("#");
    return pathname.startsWith(path);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="hidden items-center gap-1 xl:flex"
    >
      {NAV_GROUPS.map((group) => (
        <NavGroupItem
          key={group.label}
          group={group}
          open={open === group.label}
          active={isActive(group.href)}
          onOpen={() => {
            cancelClose();
            setOpen(group.label);
          }}
          onScheduleClose={scheduleClose}
          onToggle={() =>
            setOpen((cur) => (cur === group.label ? null : group.label))
          }
        />
      ))}

      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={cn(
            "relative px-3.5 py-2 text-sm font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-300",
            "after:bg-accent after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px",
            "after:origin-left after:scale-x-0 after:transition-transform",
            "after:duration-400 after:ease-[var(--ease-editorial)]",
            "hover:after:scale-x-100",
            isActive(link.href)
              ? "text-navy after:scale-x-100"
              : "text-body hover:text-navy",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function NavGroupItem({
  group,
  open,
  active,
  onOpen,
  onScheduleClose,
  onToggle,
}: {
  group: (typeof NAV_GROUPS)[number];
  open: boolean;
  active: boolean;
  onOpen: () => void;
  onScheduleClose: () => void;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <div
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onScheduleClose()}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium tracking-[0.01em] whitespace-nowrap",
          "transition-colors duration-300",
          "after:bg-accent after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-px",
          "after:origin-left after:transition-transform after:duration-400",
          "after:ease-[var(--ease-editorial)]",
          active || open
            ? "text-navy after:scale-x-100"
            : "text-body hover:text-navy after:scale-x-0",
        )}
      >
        {group.label}
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className={cn(
            "size-3.5 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute top-full left-0 w-[min(30rem,calc(100vw-3rem))] pt-4"
      >
        <div className="border-line bg-card rounded-card border p-2 shadow-[var(--shadow-float)]">
          <ul>
            {group.links.map((link) => (
              <li key={link.href}>
                <NavPanelLink link={link} />
              </li>
            ))}
          </ul>

          {group.footer && (
            <div className="border-line mt-2 border-t pt-2">
              <Link
                href={group.footer.href}
                className="text-navy hover:bg-mist flex items-center gap-1.5 rounded-input px-4 py-3 text-sm font-medium transition-colors"
              >
                {group.footer.label}
                <ArrowUpRight aria-hidden strokeWidth={1.75} className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavPanelLink({
  link,
}: {
  link: { label: string; href: string; description?: string; external?: boolean };
}) {
  const content = (
    <>
      <span className="text-navy flex items-center gap-1.5 text-sm font-medium">
        {link.label}
        {link.external && (
          <ArrowUpRight aria-hidden strokeWidth={1.75} className="text-muted size-3.5" />
        )}
      </span>
      {link.description && (
        <span className="text-muted mt-1 block text-xs">{link.description}</span>
      )}
    </>
  );

  const className =
    "block rounded-input px-4 py-3 transition-colors duration-300 hover:bg-mist";

  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}
