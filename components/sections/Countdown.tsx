"use client";

import { useSyncExternalStore } from "react";

/* ==========================================================================
   Time remaining until launch.

   The clock is an external store, so it is read with the hook built for
   external stores. That is not pedantry: the obvious version — setState in an
   effect, then setState again on an interval — makes React re-render the tree
   twice on mount and trips the cascading-render lint rule, and on a holding
   page the countdown IS the page.

   `getServerSnapshot` returns null, so the server and the first client paint
   both render dashes. React then switches to the live value. Rendering a real
   figure on the server would guarantee a mismatch: by the time the browser
   hydrates, the second has moved on.
   ========================================================================== */

let cachedNow = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

/**
 * One interval for the whole page, however many countdowns are mounted, and
 * none at all once the last one unmounts.
 *
 * `getSnapshot` has to return a stable value between ticks — React compares
 * snapshots by identity and calling `Date.now()` inside it would report a
 * change on every render, which it treats as an infinite loop.
 */
function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);

  timer ??= setInterval(() => {
    cachedNow = Date.now();
    for (const listener of listeners) listener();
  }, 1000);

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => cachedNow;
const getServerSnapshot = () => null;

export function Countdown({ targetIso }: { targetIso: string }) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const target = Date.parse(targetIso);

  const ms = now === null ? null : Math.max(0, target - now);

  if (ms === 0) {
    return (
      <p className="font-display text-paper text-display-sm">
        We are open. Refresh the page.
      </p>
    );
  }

  const units = [
    { label: "days", value: ms === null ? null : Math.floor(ms / 86_400_000) },
    { label: "hours", value: ms === null ? null : Math.floor(ms / 3_600_000) % 24 },
    { label: "minutes", value: ms === null ? null : Math.floor(ms / 60_000) % 60 },
    { label: "seconds", value: ms === null ? null : Math.floor(ms / 1000) % 60 },
  ];

  return (
    <ul
      className="flex flex-wrap justify-center gap-x-8 gap-y-6 sm:gap-x-12"
      // Changes every second. Announcing that would make the page unusable
      // with a screen reader; the launch date is given in prose above.
      aria-hidden
    >
      {units.map((unit) => (
        <li key={unit.label} className="text-center">
          <span className="font-display text-paper block text-4xl font-bold tabular-nums sm:text-6xl">
            {unit.value === null ? "––" : String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-paper/45 text-eyebrow mt-2 block uppercase">
            {unit.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
