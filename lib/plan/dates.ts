/* Date helpers shared by the schema and the calculation layer.

   Kept in their own module, free of zod and of path aliases, so calc.ts has
   no dependency beyond catalog.ts and can be exercised directly by
   scripts/verify-plan-math.mts without pulling in the whole app. */

/** Whole years between a YYYY-MM-DD date and today. */
export function yearsSince(isoDate: string, now: Date = new Date()): number {
  const then = new Date(isoDate);
  let age = now.getFullYear() - then.getFullYear();
  const beforeBirthday =
    now.getMonth() < then.getMonth() ||
    (now.getMonth() === then.getMonth() && now.getDate() < then.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}
