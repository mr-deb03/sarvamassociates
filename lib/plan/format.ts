import { formatInr } from "@/lib/content/display";

/* ==========================================================================
   Number formatting for the plan.

   Two forms, used deliberately:

     rupees()  exact, Indian grouping — for anything someone might act on or
               check against a statement.
     compact() lakh and crore — for headline figures, where ₹2,84,53,514 is
               harder to take in at a glance than "₹2.85 Crore".

   The report shows the compact form large and the exact form beside it
   wherever the figure matters.
   ========================================================================== */

export function rupees(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}₹${Math.abs(rounded).toLocaleString("en-IN")}`;
}

export const compact = (amount: number): string =>
  amount < 0 ? `-${formatInr(Math.abs(amount))}` : formatInr(amount);

export function percent(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

/** 9967354971 -> 99673 54971 */
export function phoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : phone;
}

export function dateDisplay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function dateTimeDisplay(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
