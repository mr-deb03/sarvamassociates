import type { Testimonial } from "./types";

/* ==========================================================================
   ⚠️  PLACEHOLDER CONTENT — NOT VERIFIED CLIENT STATEMENTS
   ==========================================================================

   Every entry below carries `placeholder: true`.

   The August 2026 revision document supplies these under the heading
   "Dummy Reviews". They are the client's own placeholder copy, written to
   show what the section will look like — they are not real client quotes and
   have not been attributed to or approved by any actual client.

   Consequences, all enforced elsewhere in the codebase:

   1. No star ratings render anywhere on the site. The mockup showed ★★★★★ on
      every card; presenting an invented rating as a verified one is exactly
      what brief §23 and §47 prohibit.
   2. The testimonials section renders a visible note that these are
      illustrative until real quotes replace them.
   3. `<Testimonials>` refuses to render entries where `placeholder` is true
      unless explicitly passed `allowPlaceholders`.

   TO GO LIVE WITH REAL TESTIMONIALS:
     - replace `quote`, `author` and `context` with the real, attributable text
     - obtain the client's written consent to publish it
     - set `placeholder: false` on that entry
   Nothing else needs to change.
   ========================================================================== */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "pms-first-time",
    // Revised wording from the document — the original named the partner
    // directly in a client's mouth, which is not something a client said.
    quote:
      "They helped me understand PMS for the first time. The products were excellent and Sarvam made the whole process simple — from paperwork to my first portfolio review.",
    author: "Anil K.",
    context: "Investor, Powai",
    placeholder: true,
  },
  {
    id: "middle-ground",
    quote:
      "I used to think investing meant either FDs or gambling on stocks — nothing in between. Sarvam showed me there's a whole middle ground I didn't know existed.",
    author: "Kunal T.",
    context: "IT Professional, Andheri",
    placeholder: true,
  },
  {
    id: "goals-first",
    quote:
      "What I liked most is nobody pushed me into anything. They actually asked about my goals first, then suggested products — felt backwards from every other advisor I've met.",
    author: "Meera J.",
    context: "Homemaker, Thane",
    placeholder: true,
  },
  {
    id: "tax-to-wealth",
    quote:
      "Been doing my taxes with them for years. Didn't know they also did wealth planning until my CA mentioned it during filing season — best surprise ever.",
    author: "Suresh P.",
    context: "Business Owner, Dadar",
    placeholder: true,
  },
  {
    id: "father-fd",
    quote:
      "My father only trusted FDs his whole life. I finally convinced him to diversify a bit through Sarvam — he still checks the numbers every week, but he's smiling now.",
    author: "Ananya R.",
    context: "Marketing Manager, Vile Parle",
    placeholder: true,
  },
  {
    id: "downside-first",
    quote:
      "I liked that they explained the downside before the upside. Most people only tell you how much you could make — Sarvam told me what happens if it doesn't go well too.",
    author: "Vikas D.",
    context: "Business Owner, Ghatkopar",
    placeholder: true,
  },
];

/** True while any displayed testimonial is still placeholder copy. */
export const HAS_PLACEHOLDER_TESTIMONIALS = TESTIMONIALS.some(
  (t) => t.placeholder,
);

/** Real, publishable testimonials only. Empty until consent is obtained. */
export const VERIFIED_TESTIMONIALS = TESTIMONIALS.filter((t) => !t.placeholder);
