"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * Hero backdrop.
 *
 * The previous version put a gold line chart beside the headline. Both halves
 * of that were wrong for this design language: a chart sitting next to a
 * headline about beating FD returns reads as a performance claim, and a
 * champagne curve at that size spends the entire 2% accent budget in one
 * element.
 *
 * What replaces it is atmosphere only — two very soft warm-neutral washes that
 * give the ivory ground some depth. The hero's impact comes from the type.
 *
 * Parallax is ~10px, gated on a fine pointer so it never runs on touch, and
 * skipped entirely under reduced motion. Financial sites must feel stable.
 */
export function HeroBackdrop() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const px = useSpring(x, { stiffness: 50, damping: 22, mass: 0.7 });
  const py = useSpring(y, { stiffness: 50, damping: 22, mass: 0.7 });

  const driftX = useTransform(px, [-1, 1], [12, -12]);
  const driftY = useTransform(py, [-1, 1], [10, -10]);
  const counterX = useTransform(px, [-1, 1], [-8, 8]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={{ x: driftX, y: driftY }}
        className="absolute -top-[20%] -right-[15%] size-[70vw] max-w-[60rem] rounded-full bg-[radial-gradient(circle,var(--color-sand)_0%,transparent_66%)] opacity-70"
      />
      <motion.div
        style={{ x: counterX }}
        className="absolute -bottom-[30%] -left-[20%] size-[55vw] max-w-[48rem] rounded-full bg-[radial-gradient(circle,var(--color-sand)_0%,transparent_62%)] opacity-50"
      />
    </div>
  );
}
