import "server-only";

/* ==========================================================================
   SMS delivery.

   Same shape as lib/forms/deliver.ts: the provider lives behind one function
   so the route handler, the OTP logic and the UI never learn which vendor is
   in use. Switching from MSG91 to Twilio is an env change, not a code change.

   Set SMS_PROVIDER to one of: msg91 | twilio | webhook | console.

   With nothing set, development logs the code to the terminal and the
   verification screen shows it, so the whole flow is testable without an SMS
   account. Production refuses to pretend: an unconfigured provider returns a
   failure rather than silently dropping the message, because a visitor
   waiting for a code that was never sent is worse than an honest error.
   ========================================================================== */

export interface SmsResult {
  ok: boolean;
  /** Internal only. Never surfaced to the browser. */
  detail?: string;
  /**
   * Set ONLY by the console provider outside production, so the verification
   * screen can display the code during development. Never populated by a real
   * provider, and the route handler strips it in production regardless.
   */
  devCode?: string;
}

type Provider = "msg91" | "twilio" | "webhook" | "console";

function currentProvider(): Provider {
  const configured = process.env.SMS_PROVIDER?.toLowerCase();
  if (
    configured === "msg91" ||
    configured === "twilio" ||
    configured === "webhook" ||
    configured === "console"
  ) {
    return configured;
  }
  return "console";
}

/** Whether a real provider is wired up. The UI copy changes if not. */
export function smsConfigured(): boolean {
  return currentProvider() !== "console";
}

/**
 * Sends the OTP.
 *
 * `code` is passed separately from any message template because MSG91 and
 * most Indian DLT-registered senders take the variable, not the final string —
 * the message body itself is fixed by the approved template.
 */
export async function sendOtpSms(
  phone: string,
  code: string,
): Promise<SmsResult> {
  const provider = currentProvider();
  const e164 = `+91${phone}`;

  try {
    switch (provider) {
      case "msg91":
        return await sendViaMsg91(phone, code);
      case "twilio":
        return await sendViaTwilio(e164, code);
      case "webhook":
        return await sendViaWebhook(e164, code);
      case "console":
        return sendViaConsole(phone, code);
    }
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "unknown transport error",
    };
  }
}

/* -------------------------------------------------------------- providers */

function sendViaConsole(phone: string, code: string): SmsResult {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[plan] SMS_PROVIDER is not configured. A verification code was requested " +
        `for ${maskPhone(phone)} and could not be sent.`,
    );
    return { ok: false, detail: "no SMS provider configured" };
  }

  console.info(
    `\n[plan] ─── verification code for ${maskPhone(phone)}: ${code} ───\n`,
  );
  return { ok: true, devCode: code };
}

/**
 * MSG91 OTP endpoint. Needs an approved DLT template whose body contains the
 * ##OTP## variable; `MSG91_TEMPLATE_ID` names it.
 */
async function sendViaMsg91(phone: string, code: string): Promise<SmsResult> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    return { ok: false, detail: "MSG91_AUTH_KEY or MSG91_TEMPLATE_ID is unset" };
  }

  const response = await fetch("https://control.msg91.com/api/v5/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json", authkey: authKey },
    body: JSON.stringify({
      template_id: templateId,
      mobile: `91${phone}`,
      otp: code,
      otp_expiry: Math.round(OTP_TTL_MS / 60_000),
    }),
  });

  if (!response.ok) {
    return { ok: false, detail: `msg91 responded ${response.status}` };
  }

  // MSG91 returns HTTP 200 with {"type":"error"} for template and DLT faults,
  // so the status code alone is not enough to call this a success.
  const body = (await response.json().catch(() => null)) as {
    type?: string;
    message?: string;
  } | null;

  if (body?.type === "error") {
    return { ok: false, detail: `msg91: ${body.message ?? "rejected"}` };
  }
  return { ok: true };
}

async function sendViaTwilio(e164: string, code: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    return { ok: false, detail: "Twilio credentials are incomplete" };
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: e164,
        From: from,
        Body: `${code} is your Sarvam Associates verification code. It expires in ${Math.round(
          OTP_TTL_MS / 60_000,
        )} minutes. Do not share it with anyone.`,
      }),
    },
  );

  if (!response.ok) {
    return { ok: false, detail: `twilio responded ${response.status}` };
  }
  return { ok: true };
}

/** Escape hatch: hand the send off to any endpoint the practice already runs. */
async function sendViaWebhook(e164: string, code: string): Promise<SmsResult> {
  const url = process.env.SMS_WEBHOOK_URL;
  if (!url) return { ok: false, detail: "SMS_WEBHOOK_URL is unset" };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.SMS_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.SMS_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({ to: e164, code, purpose: "financial-plan-otp" }),
  });

  if (!response.ok) {
    return { ok: false, detail: `webhook responded ${response.status}` };
  }
  return { ok: true };
}

/* ---------------------------------------------------------------- helpers */

/** 9967354971 -> 99***4971. Used in logs so numbers are not written in full. */
export function maskPhone(phone: string): string {
  if (phone.length < 6) return "***";
  return `${phone.slice(0, 2)}***${phone.slice(-4)}`;
}

/** Re-exported from here so the SMS templates and the OTP logic agree. */
export const OTP_TTL_MS = 10 * 60 * 1000;
