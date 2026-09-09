"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Scroll-linked progress rail for the process timeline.
 *
 * The rail is absolutely positioned behind server-rendered step markup that
 * passes through as `children` — the steps themselves never move, never
 * animate, and never enter the client bundle. Only the champagne fill is
 * driven by scroll.
 *
 * Geometry matches the step markers: on desktop they sit at the top of each
 * column (18px from the top of a 36px marker); on mobile they run down the
 * left at the same offset.
 */
export function TimelineProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 78%", "end 60%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  const scale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative">
      {/*
        Desktop: horizontal rail running from the first marker's centre to the
        last one's, rather than edge to edge — a rail that overshoots the final
        step reads as an unfinished process.

        The right inset is derived from the grid it sits behind (4 columns,
        gap-10, 36px markers): the last marker's centre is at 0.75W + 0.75·gap
        + 18px, which leaves 25% − 3rem on the right.
      */}
      <div
        aria-hidden
        className="bg-ivory/12 absolute top-[1.125rem] right-[calc(25%-3rem)] left-[1.125rem] hidden h-px lg:block"
      >
        <motion.div
          style={{ scaleX: scale }}
          className="bg-champagne h-full origin-left"
        />
      </div>

      {/* Mobile: vertical rail down the left */}
      <div
        aria-hidden
        className="bg-ivory/12 absolute top-4 bottom-4 left-[1.125rem] w-px lg:hidden"
      >
        <motion.div
          style={{ scaleY: scale }}
          className="bg-champagne h-full w-full origin-top"
        />
      </div>

      {children}
    </div>
  );
}
