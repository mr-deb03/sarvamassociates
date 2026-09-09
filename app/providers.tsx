"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * The single motion switch for the whole site.
 *
 * `reducedMotion="user"` makes every `motion`/`m` component skip transform and
 * layout animation while preserving opacity fades, for users who have asked
 * their OS for reduced motion. Because it is set once here, no component needs
 * its own `useReducedMotion()` check.
 *
 * This is a client component, but it only wraps `children` — the server-rendered
 * tree passed through it stays on the server and never enters the client bundle.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
