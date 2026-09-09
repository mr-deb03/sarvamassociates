import { z } from "zod";

/* ==========================================================================
   Consultation lead form.

   One schema, used in three places: client-side validation, the route handler,
   and the inferred TypeScript type. Hand-rolling this would mean writing the
   rules twice and letting the two copies drift.

   DELIBERATELY NOT COLLECTED (brief §26): PAN, Aadhaar, bank details, existing
   portfolio values, income, or date of birth. A website lead form has no
   business holding any of it, and asking depresses conversion besides.
   ========================================================================== */

export const INTERESTS = [
  "investment",
  "tax-planning",
  "insurance",
  "loan-liquidity",
  "wealth-planning",
  "other",
] as const;
export type Interest = (typeof INTERESTS)[number];

export const INTEREST_LABELS: Record<Interest, string> = {
  investment: "Investing & wealth creation",
  "tax-planning": "Tax planning & compliance",
  insurance: "Insurance & protection",
  "loan-liquidity": "Loan against securities",
  "wealth-planning": "Overall financial planning",
  other: "Something else",
};

export const CONTACT_METHODS = ["phone", "whatsapp", "email"] as const;
export const CONTACT_METHOD_LABELS: Record<
  (typeof CONTACT_METHODS)[number],
  string
> = {
  phone: "Phone call",
  whatsapp: "WhatsApp",
  email: "Email",
};

export const CALLBACK_WINDOWS = [
  "morning",
  "afternoon",
  "evening",
  "anytime",
] as const;
export const CALLBACK_LABELS: Record<
  (typeof CALLBACK_WINDOWS)[number],
  string
> = {
  morning: "Morning (9am – 12pm)",
  afternoon: "Afternoon (12pm – 5pm)",
  evening: "Evening (5pm – 8pm)",
  anytime: "Any time works",
};

/**
 * Normalises Indian mobile input.
 * "98765 43210", "+91-98765-43210", "09876543210" all become "9876543210".
 */
export function normalizeIndianMobile(raw: string): string {
  return raw.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, "");
}

export const consultationSchema = z.object({
  /* --- Step 1: what they want --- */
  interest: z.enum(INTERESTS, {
    message: "Please choose what you'd like to talk about",
  }),

  /* --- Step 2: how to reach them --- */
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "That name is longer than we can store"),

  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number")
    .transform(normalizeIndianMobile)
    // Indian mobile numbers are 10 digits beginning 6–9.
    .refine((v) => /^[6-9]\d{9}$/.test(v), {
      message: "Enter a valid 10-digit Indian mobile number",
    }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Please enter your email address")
    .email("Enter a valid email address"),

  /* --- Step 3: when --- */
  preferredContact: z.enum(CONTACT_METHODS).default("phone"),
  callbackWindow: z.enum(CALLBACK_WINDOWS).default("anytime"),
  message: z
    .string()
    .trim()
    .max(1000, "Please keep this under 1000 characters")
    .optional(),

  consent: z.literal(true, {
    message: "Please confirm you're happy for us to contact you",
  }),

  /**
   * Honeypot. Bots fill it; humans never see it.
   *
   * Deliberately NOT constrained here. If the schema rejected a filled
   * honeypot, the response would carry a field error naming `company` — which
   * tells a bot exactly which field caught it, and leaks a raw validator
   * message to the client. Instead this always validates, and the route
   * handler checks it and returns a plain success without delivering anything.
   */
  company: z.string().optional(),
});

/** The form's own type — phone is still a raw string here. */
export type ConsultationInput = z.input<typeof consultationSchema>;
/** Post-validation, post-transform. Phone is normalised to 10 digits. */
export type ConsultationData = z.output<typeof consultationSchema>;

/** Which fields belong to which step, for per-step validation. */
export const STEP_FIELDS = [
  ["interest"],
  ["name", "phone", "email"],
  ["preferredContact", "callbackWindow", "message", "consent"],
] as const satisfies readonly (readonly (keyof ConsultationInput)[])[];
