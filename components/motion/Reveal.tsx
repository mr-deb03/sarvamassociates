import type { ElementType, ReactNode } from "react";

/**
 * Scroll-reveal wrapper — a SERVER component.
 *
 * It renders nothing but a `data-reveal` attribute. All motion lives in CSS
 * (see globals.css) and a single IntersectionObserver in <RevealObserver />
 * flips `data-revealed` on. Consequences that matter:
 *
 *  - Content is visible without JavaScript. The hidden state is scoped to
 *    `html.js`, which only exists once the bootstrap script has run.
 *  - No animation library on this path, and no client boundary per section —
 *    wrapped subtrees stay entirely server-rendered.
 *  - Reduced motion is handled by the CSS media query, so nothing here needs
 *    to check for it.
 */
export function Reveal({
  children,
  preset = "fadeUp",
  className,
  as: Component = "div",
  tall = false,
}: {
  children: ReactNode;
  /** "stagger" cascades descendant <RevealItem>s instead of itself. */
  preset?: "fadeUp" | "stagger";
  className?: string;
  as?: ElementType;
  /** Looser in-view threshold, for blocks taller than the viewport. */
  tall?: boolean;
}) {
  return (
    <Component
      className={className}
      data-reveal={preset}
      data-reveal-tall={tall ? "" : undefined}
    >
      {children}
    </Component>
  );
}

/** A cascading child of <Reveal preset="stagger">. Also a server component. */
export function RevealItem({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Component className={className} data-reveal-item="">
      {children}
    </Component>
  );
}
