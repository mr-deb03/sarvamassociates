import type { Variants } from "motion/react";

/**
 * Shared animation variants.
 *
 * Plain objects — importable from any client component, zero runtime cost
 * where unused. Reduced-motion is handled centrally by <MotionConfig
 * reducedMotion="user"> in app/providers.tsx, so nothing here needs its own
 * check.
 */

/** The house easing. Matches --ease-editorial in globals.css. */
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_EDITORIAL },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_EDITORIAL } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_EDITORIAL },
  },
};

/**
 * Reserved for display headings and champagne hairline rules. This is the motif
 * that reads "editorial" — using it everywhere destroys it. Two or three per
 * page, at most.
 */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.9, ease: EASE_EDITORIAL },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/** Standard in-view trigger. Animate once; never replay on scroll-back. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

/** Looser trigger for tall blocks that never reach 25% in a short viewport. */
export const VIEWPORT_TALL = { once: true, amount: 0.1 } as const;
