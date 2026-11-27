/**
 * Contact form helpers
 *
 * Pure functions so validation and email building can be tested
 * outside the Cloudflare runtime.
 */

const LIMITS = { name: 100, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

function clean(value) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

/**
 * Validates a contact submission.
 * Returns { valid, data } or { valid: false, error }.
 * A filled honeypot ("website") is reported as spam so the caller can
 * pretend success without sending anything.
 */
function validateSubmission(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request" };
  }

  if (clean(body.website) !== "") {
    return { valid: false, spam: true, error: "Invalid request" };
  }

  const name = clean(body.name).replace(/[\r\n]+/g, " ");
  const email = clean(body.email);
  const message = clean(body.message);

  if (!name || !email || !message) {
    return { valid: false, error: "Name, email and message are required" };
  }
  if (name.length > LIMITS.name) {
    return { valid: false, error: `Name is too long (max ${LIMITS.name} characters)` };
  }
  if (email.length > LIMITS.email || !EMAIL_RE.test(email) || /[\r\n]/.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  if (message.length > LIMITS.message) {
    return { valid: false, error: `Message is too long (max ${LIMITS.message} characters)` };
  }

  return { valid: true, data: { name, email, message } };
}

/**
 * True when the request comes from the same origin as the function
 * (or carries no Origin header, as some same-origin POSTs do).
 */
function isSameOrigin(originHeader, requestUrl) {
  if (!originHeader) return true;
  try {
    return new URL(originHeader).origin === new URL(requestUrl).origin;
  } catch {
    return false;
  }
}

/**
 * Builds the Resend API payload. Plain text only, so nothing the visitor
 * types is ever rendered as HTML.
 */
function buildEmail({ name, email, message }, env = {}) {
  return {
    from: env.CONTACT_FROM || "Website contact form <form@colinmcarthur.com>",
    to: [env.CONTACT_TO || "hello@colinmcarthur.com"],
    reply_to: email,
    subject: `Website message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
  };
}

module.exports = { validateSubmission, isSameOrigin, buildEmail, LIMITS };
