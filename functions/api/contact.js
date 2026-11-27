/**
 * Contact form endpoint
 *
 * POST /api/contact  { name, email, message, website (honeypot) }
 * Sends the message to Colin by email through the Resend API.
 *
 * Env vars (Cloudflare Pages > Settings > Variables, or .dev.vars locally):
 *   RESEND_API_KEY  required
 *   CONTACT_TO      optional, defaults to colinsba@gmail.com
 *   CONTACT_FROM    optional, defaults to onboarding@resend.dev (works only
 *                   for the Resend account owner's address until a domain is verified)
 */

const helpers = require("./contact-helpers");

const MAX_BODY_BYTES = 20000;

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, { Allow: "POST" });
  }

  if (!helpers.isSameOrigin(request.headers.get("Origin"), request.url)) {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > MAX_BODY_BYTES) {
    return jsonResponse({ error: "Message is too large" }, 413);
  }

  let body;
  try {
    const contentType = request.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      body = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return jsonResponse({ error: "Invalid request" }, 400);
  }

  const result = helpers.validateSubmission(body);
  if (result.spam) {
    // Pretend success so bots get no signal.
    return jsonResponse({ ok: true }, 200);
  }
  if (!result.valid) {
    return jsonResponse({ error: result.error }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return jsonResponse({ error: "Contact form is not configured yet. Please email me directly." }, 503);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(helpers.buildEmail(result.data, env)),
    });

    if (!response.ok) {
      return jsonResponse({ error: "Unable to send right now. Please email me directly." }, 502);
    }
    return jsonResponse({ ok: true }, 200);
  } catch {
    return jsonResponse({ error: "Unable to send right now. Please email me directly." }, 502);
  }
}

function jsonResponse(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}
