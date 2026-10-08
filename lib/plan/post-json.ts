/* ==========================================================================
   POSTing to the planner's own endpoints, from the browser.

   WHY THIS EXISTS

   Every call site used to do this:

       const response = await fetch(url, ...)
       const result = await response.json()        // <- inside the try
       ...
       } catch { setError("We could not reach the server...") }

   which is wrong in a way that only shows up in production. When a route
   handler throws, Next returns a 500 with an EMPTY body. `response.json()`
   then throws on the empty body, the catch fires, and the visitor is told to
   check their internet connection — while the actual fault is a server-side
   exception that nobody has been told about.

   That exact sequence sent a live deployment chasing a network problem that
   did not exist. So: the fetch is the only thing inside the try, the body is
   read as text and parsed defensively, and a server fault is reported as a
   server fault.
   ========================================================================== */

export interface JsonResponse {
  /** True only when the request arrived AND the endpoint reported success. */
  ok: boolean;
  /** HTTP status, or null when the request never reached a server at all. */
  status: number | null;
  /** The parsed body, when the server sent JSON. Null when it did not. */
  payload: Record<string, unknown> | null;
  /** A message safe to show the visitor. Empty string when `ok`. */
  error: string;
}

/** Shown only when the request itself failed — DNS, offline, blocked. */
const NETWORK =
  "We could not reach the server. Check your connection and try again.";

/**
 * Shown when the server answered but could not produce a sensible reply.
 *
 * It names the status deliberately. A visitor who emails "I get error 500"
 * has handed over the one fact that makes the problem findable, and it stops
 * them wasting an afternoon on their own wifi.
 */
function serverFault(status: number, contact: string): string {
  if (status === 429) {
    return "That is a few too many attempts in a short space of time. Please wait a minute and try again.";
  }
  if (status >= 500) {
    return `Something went wrong at our end (error ${status}). Please try again in a moment — this is not your connection. If it keeps happening, email ${contact} and we will sort it out with you.`;
  }
  return `That request could not be completed (error ${status}). Please try again, or email ${contact}.`;
}

export async function postJson(
  url: string,
  body: unknown,
  contactEmail: string,
): Promise<JsonResponse> {
  let response: Response;

  // Only the request is guarded here. Anything after this point is a server
  // that answered, which is a different problem with a different message.
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, status: null, payload: null, error: NETWORK };
  }

  const text = await response.text().catch(() => "");

  let payload: Record<string, unknown> | null = null;
  try {
    const parsed = text ? JSON.parse(text) : null;
    if (parsed && typeof parsed === "object") {
      payload = parsed as Record<string, unknown>;
    }
  } catch {
    // An HTML error page, a proxy message, or an empty body. Handled below.
  }

  if (response.ok && payload?.ok === true) {
    return { ok: true, status: response.status, payload, error: "" };
  }

  // The endpoint reported a problem in its own words — always prefer those.
  if (typeof payload?.error === "string" && payload.error.length > 0) {
    return { ok: false, status: response.status, payload, error: payload.error };
  }

  return {
    ok: false,
    status: response.status,
    payload,
    error: serverFault(response.status, contactEmail),
  };
}

/** DELETE, same contract. Used by the admin panel. */
export async function deleteJson(
  url: string,
  contactEmail: string,
): Promise<JsonResponse> {
  let response: Response;

  try {
    response = await fetch(url, { method: "DELETE" });
  } catch {
    return { ok: false, status: null, payload: null, error: NETWORK };
  }

  const text = await response.text().catch(() => "");

  let payload: Record<string, unknown> | null = null;
  try {
    const parsed = text ? JSON.parse(text) : null;
    if (parsed && typeof parsed === "object") {
      payload = parsed as Record<string, unknown>;
    }
  } catch {
    /* handled below */
  }

  if (response.ok && payload?.ok === true) {
    return { ok: true, status: response.status, payload, error: "" };
  }

  if (typeof payload?.error === "string" && payload.error.length > 0) {
    return { ok: false, status: response.status, payload, error: payload.error };
  }

  return {
    ok: false,
    status: response.status,
    payload,
    error: serverFault(response.status, contactEmail),
  };
}
