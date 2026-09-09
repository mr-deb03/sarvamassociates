"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

interface AnimatedCounterProps {
  /** The final value. Server already rendered this; we only animate up to it. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  className?: string;
}

/**
 * Counts up to `value` when scrolled into view.
 *
 * Hydration safety — three rules, all load-bearing:
 *
 * 1. The server renders the FINAL value inside this element's markup. This
 *    component only replaces the text after mount, so pre-JS, no-JS and
 *    crawler views all see "500+" rather than "0+".
 * 2. Intermediate frames are written imperatively via `textContent`, not
 *    through React state. State-driven interpolation re-renders 60x/sec and,
 *    if it initialises to anything but the server value, produces a hydration
 *    mismatch.
 * 3. Nothing non-deterministic runs during render.
 *
 * Reduced motion is handled by <MotionConfig reducedMotion="user">, but
 * `animate()` is imperative and sits outside that, so it is checked directly.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current) return;
    const node = ref.current;
    if (!node) return;

    hasRun.current = true;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return; // Server value already correct — leave it.

    // Decimal values (1.5) need one place; integers stay clean.
    const decimals = value % 1 === 0 ? 0 : 1;

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        node.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      },
      onComplete() {
        node.textContent = `${prefix}${value}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, value, prefix, suffix, duration]);

  return (
    // `tnum` prevents the container reflowing on every frame as proportional
    // digits change width.
    <span ref={ref} className={`tnum ${className ?? ""}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
