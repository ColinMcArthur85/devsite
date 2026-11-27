const { validateSubmission, isSameOrigin, buildEmail, LIMITS } = require("./contact-helpers");

describe("validateSubmission", () => {
  const ok = { name: "Ada", email: "ada@example.com", message: "Hello" };

  test("accepts a valid submission and trims fields", () => {
    const r = validateSubmission({ name: "  Ada ", email: " ada@example.com ", message: " Hi " });
    expect(r).toEqual({ valid: true, data: { name: "Ada", email: "ada@example.com", message: "Hi" } });
  });

  test("rejects missing fields", () => {
    expect(validateSubmission({ ...ok, message: "" }).valid).toBe(false);
    expect(validateSubmission(null).valid).toBe(false);
  });

  test("rejects invalid email and header injection", () => {
    expect(validateSubmission({ ...ok, email: "nope" }).valid).toBe(false);
    expect(validateSubmission({ ...ok, email: "a@b.com\r\nBcc: x@y.com" }).valid).toBe(false);
  });

  test("collapses newlines in name so it is safe in the subject", () => {
    const r = validateSubmission({ ...ok, name: "Ada\r\nBcc: x@y.com" });
    expect(r.data.name).not.toMatch(/[\r\n]/);
  });

  test("enforces length limits", () => {
    expect(validateSubmission({ ...ok, message: "x".repeat(LIMITS.message + 1) }).valid).toBe(false);
    expect(validateSubmission({ ...ok, name: "x".repeat(LIMITS.name + 1) }).valid).toBe(false);
  });

  test("flags a filled honeypot as spam", () => {
    const r = validateSubmission({ ...ok, website: "http://spam" });
    expect(r.valid).toBe(false);
    expect(r.spam).toBe(true);
  });
});

describe("isSameOrigin", () => {
  test("allows matching or missing origin", () => {
    expect(isSameOrigin("https://colinmcarthur.com", "https://colinmcarthur.com/api/contact")).toBe(true);
    expect(isSameOrigin(null, "https://colinmcarthur.com/api/contact")).toBe(true);
  });

  test("rejects other origins and garbage", () => {
    expect(isSameOrigin("https://evil.example", "https://colinmcarthur.com/api/contact")).toBe(false);
    expect(isSameOrigin("not a url", "https://colinmcarthur.com/api/contact")).toBe(false);
  });
});

describe("buildEmail", () => {
  test("uses defaults and sets reply_to to the visitor", () => {
    const e = buildEmail({ name: "Ada", email: "ada@example.com", message: "Hi" });
    expect(e.to).toEqual(["colinsba@gmail.com"]);
    expect(e.reply_to).toBe("ada@example.com");
    expect(e.text).toContain("Hi");
    expect(e).not.toHaveProperty("html");
  });

  test("respects env overrides", () => {
    const e = buildEmail({ name: "A", email: "a@b.co", message: "m" }, { CONTACT_TO: "me@colinmcarthur.com", CONTACT_FROM: "x <x@colinmcarthur.com>" });
    expect(e.to).toEqual(["me@colinmcarthur.com"]);
    expect(e.from).toBe("x <x@colinmcarthur.com>");
  });
});
