import { TRUST_CHIPS } from "@/lib/content/homepage";

/**
 * Trust strip.
 *
 * Every claim here is corroborated across the source files. Two that appeared
 * in the original mockup are deliberately absent: "SEBI Registered Investment
 * Advisor" (Sarvam operates as an AMFI-registered distributor — the two cannot
 * both be claimed) and "₹1Cr+ assets guided" (internally inconsistent with the
 * other figures on the same page).
 *
 * Set as a quiet rule of four rather than a row of badges — no icon plates, no
 * colour. It is a statement of record, not a feature list.
 */
export function TrustStrip() {
  return (
    <section aria-label="Credentials" className="border-line border-y">
      <div className="container-page">
        <ul className="divide-line grid divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {TRUST_CHIPS.map((chip) => (
            <li key={chip.strong} className="py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <p className="text-navy text-sm font-semibold tracking-[0.01em]">
                {chip.strong}
              </p>
              <p className="text-muted mt-1.5 text-sm">{chip.rest}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
