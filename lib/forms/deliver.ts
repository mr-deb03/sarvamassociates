import "server-only";
import { createTransport } from "nodemailer";
import { COMPANY } from "@/lib/content/company";
import {
  CALLBACK_LABELS,
  CONTACT_METHOD_LABELS,
  INTEREST_LABELS,
  type ConsultationData,
} from "./consultation-schema";

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

/** The lead as it leaves this file: validated, and without the honeypot. */
type Lead = Omit<ConsultationData, "company">;

/**
 * Sends the lead to every destination that is configured:
 *
 *   - email, through the practice's own mailbox, when SMTP_USER and
 *     SMTP_PASSWORD are set
 *   - a JSON POST, when LEAD_WEBHOOK_URL is set
 *
 * One destination accepting the lead is a success: a visitor should not be
 * told to try again because a second copy failed. The failure is still logged.
 */
export async function deliverLead(
  lead: ConsultationData,
): Promise<DeliveryResult> {
  // Strip the honeypot — it is never forwarded to a downstream system.
  const { company, ...payload } = lead;
  void company;

  const attempts: Promise<DeliveryResult>[] = [];
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    attempts.push(sendEmail(payload));
  }
  if (process.env.LEAD_WEBHOOK_URL) {
    attempts.push(postWebhook(process.env.LEAD_WEBHOOK_URL, payload));
  }

  if (attempts.length === 0) {
    // Development / pre-launch. Never log in production without a destination —
    // lead data should not sit in server logs indefinitely.
    if (process.env.NODE_ENV !== "production") {
      console.info("[consultation] lead received", payload);
    } else {
      console.warn(
        "[consultation] neither SMTP_USER/SMTP_PASSWORD nor LEAD_WEBHOOK_URL is configured — lead was accepted but not delivered anywhere.",
      );
    }
    return { ok: true };
  }

  const results = await Promise.all(attempts);
  const failures = results
    .filter((r) => !r.ok)
    .map((r) => r.detail)
    .join("; ");

  if (results.some((r) => r.ok)) {
    if (failures) {
      console.error("[consultation] partial delivery failure:", failures);
    }
    return { ok: true };
  }
  return { ok: false, detail: failures };
}

/* --------------------------------------------------------------- email */

/** LEAD_EMAIL_TO is a comma-separated list; the practice's own address is the fallback. */
function recipients(): string[] {
  const list = (process.env.LEAD_EMAIL_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  return list.length > 0 ? list : [COMPANY.email];
}

async function sendEmail(lead: Lead): Promise<DeliveryResult> {
  const user = process.env.SMTP_USER as string;
  const port = Number(process.env.SMTP_PORT) || 465;

  const transport = createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    // 465 is TLS from the first byte. Any other port must upgrade with
    // STARTTLS before the password is sent, or the connection is refused.
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass: process.env.SMTP_PASSWORD },
    // A serverless function must not sit on a dead socket until it is killed.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const lines = [
    "A consultation request was submitted on the website.",
    "",
    `Name:           ${lead.name}`,
    `Mobile:         +91 ${lead.phone}`,
    `Email:          ${lead.email}`,
    `Interested in:  ${INTEREST_LABELS[lead.interest]}`,
    `Contact by:     ${CONTACT_METHOD_LABELS[lead.preferredContact]}`,
    `Best time:      ${CALLBACK_LABELS[lead.callbackWindow]}`,
  ];
  if (lead.message) {
    lines.push("", "Message:", lead.message);
  }
  lines.push("", "Replying to this email writes to the person who enquired.");

  try {
    await transport.sendMail({
      // The mailbox that authenticated. Hostinger rejects any other sender.
      from: { name: `${COMPANY.name} website`, address: user },
      to: recipients(),
      replyTo: { name: lead.name, address: lead.email },
      // A subject is a header: keep the name on one line.
      subject: `New consultation request — ${lead.name.replace(/\s+/g, " ")}`,
      text: lines.join("\n"),
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      detail: `email: ${error instanceof Error ? error.message : "unknown error"}`,
    };
  }
}

/* ------------------------------------------------------------- webhook */

async function postWebhook(url: string, lead: Lead): Promise<DeliveryResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "sarvamassociates.com consultation form",
        receivedAt: new Date().toISOString(),
        ...lead,
      }),
    });

    if (!response.ok) {
      return { ok: false, detail: `webhook responded ${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      detail: `webhook: ${error instanceof Error ? error.message : "unknown transport error"}`,
    };
  }
}
