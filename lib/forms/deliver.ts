import "server-only";
import type { ConsultationData } from "./consultation-schema";

/* ==========================================================================
   Lead delivery.

   The route handler owns the provider so the client contract never changes.
   Swapping how leads are delivered touches this file only — no component, no
   API shape, no redeploy of the form.

   This is why the browser does not POST to a third-party form service
   directly: that would hardcode a vendor into the client bundle, expose the
   endpoint to scraping, and leave no server-side validation.
   ========================================================================== */

export interface DeliveryResult {
  ok: boolean;
  /** Internal only — never returned to the browser. */
  detail?: string;
}

/**
 * Current implementation: log and succeed.
 *
 * TO GO LIVE, replace the body of this function with one of:
 *
 *   a) Email via Resend / Zoho to COMPANY.email
 *      const res = await fetch("https://api.resend.com/emails", {
 *        method: "POST",
 *        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, ... },
 *        body: JSON.stringify({ ... }),
 *      });
 *
 *   b) Append to a Google Sheet via a service account
 *   c) POST to a CRM webhook
 *
 * Nothing else in the codebase needs to change.
 */
export async function deliverLead(
  lead: ConsultationData,
): Promise<DeliveryResult> {
  // Strip the honeypot — it is never forwarded to a downstream system.
  const { company, ...payload } = lead;
  void company;

  if (!process.env.LEAD_WEBHOOK_URL) {
    // Development / pre-launch. Never log in production without a destination —
    // lead data should not sit in server logs indefinitely.
    if (process.env.NODE_ENV !== "production") {
      console.info("[consultation] lead received", payload);
    } else {
      console.warn(
        "[consultation] LEAD_WEBHOOK_URL is not configured — lead was accepted but not delivered anywhere.",
      );
    }
    return { ok: true };
  }

  try {
    const response = await fetch(process.env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "sarvamassociates.com consultation form",
        receivedAt: new Date().toISOString(),
        ...payload,
      }),
    });

    if (!response.ok) {
      return { ok: false, detail: `webhook responded ${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "unknown transport error",
    };
  }
}
