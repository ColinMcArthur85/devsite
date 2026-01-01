/**
 * Sanitization Utility Tests
 *
 * TDD: RED Phase - These tests should FAIL initially
 * because the implementation doesn't exist yet.
 */

// Import the module (will fail until we create it)
const { escapeHtml, stripTags, sanitizeForUrl, sanitizeText } = require("./sanitize");

describe("escapeHtml", () => {
  test("escapes < and > characters", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  test("escapes & character", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  test("escapes \" and ' characters", () => {
    expect(escapeHtml('"quoted"')).toBe("&quot;quoted&quot;");
    expect(escapeHtml("it's")).toBe("it&#x27;s");
  });

  test("handles multiple special characters", () => {
    expect(escapeHtml('<a href="test">')).toBe("&lt;a href=&quot;test&quot;&gt;");
  });

  test("returns empty string for null/undefined", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  test("converts numbers to string", () => {
    expect(escapeHtml(123)).toBe("123");
  });

  test("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  test("preserves safe text", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});

describe("stripTags", () => {
  test("removes simple HTML tags", () => {
    expect(stripTags("<p>Hello</p>")).toBe("Hello");
  });

  test("removes script tags and content", () => {
    expect(stripTags('<script>alert("xss")</script>')).toBe("");
  });

  test("removes multiple tags", () => {
    expect(stripTags("<div><p>Hello</p><span>World</span></div>")).toBe("HelloWorld");
  });

  test("handles self-closing tags", () => {
    expect(stripTags("Hello<br/>World")).toBe("HelloWorld");
  });

  test("removes attributes", () => {
    expect(stripTags('<a href="evil.com" onclick="steal()">Click</a>')).toBe("Click");
  });

  test("returns empty string for null/undefined", () => {
    expect(stripTags(null)).toBe("");
    expect(stripTags(undefined)).toBe("");
  });

  test("handles malformed HTML", () => {
    expect(stripTags("<div>Unclosed")).toBe("Unclosed");
  });
});

describe("sanitizeForUrl", () => {
  test("encodes special URL characters", () => {
    expect(sanitizeForUrl("hello world")).toBe("hello%20world");
  });

  test("removes javascript: protocol", () => {
    expect(sanitizeForUrl("javascript:alert(1)")).toBe("");
  });

  test("removes data: protocol", () => {
    expect(sanitizeForUrl("data:text/html,<script>alert(1)</script>")).toBe("");
  });

  test("allows http URLs", () => {
    expect(sanitizeForUrl("http://example.com")).toBe("http://example.com");
  });

  test("allows https URLs", () => {
    expect(sanitizeForUrl("https://example.com")).toBe("https://example.com");
  });

  test("allows relative URLs", () => {
    expect(sanitizeForUrl("/path/to/page")).toBe("/path/to/page");
  });

  test("returns empty string for null/undefined", () => {
    expect(sanitizeForUrl(null)).toBe("");
    expect(sanitizeForUrl(undefined)).toBe("");
  });

  test("handles case-insensitive javascript protocol", () => {
    expect(sanitizeForUrl("JAVASCRIPT:alert(1)")).toBe("");
    expect(sanitizeForUrl("JaVaScRiPt:alert(1)")).toBe("");
  });
});

describe("sanitizeText", () => {
  test("combines stripTags and escapeHtml", () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe("");
  });

  test("escapes remaining special characters after stripping", () => {
    expect(sanitizeText("<p>Tom & Jerry</p>")).toBe("Tom &amp; Jerry");
  });

  test("handles complex XSS attempts", () => {
    const xss = '<img src=x onerror="alert(1)">';
    expect(sanitizeText(xss)).not.toContain("<");
    expect(sanitizeText(xss)).not.toContain(">");
    expect(sanitizeText(xss)).not.toContain("onerror");
  });

  test("returns empty string for null/undefined", () => {
    expect(sanitizeText(null)).toBe("");
    expect(sanitizeText(undefined)).toBe("");
  });
});

describe("XSS Prevention Vectors", () => {
  // Common XSS attack vectors that should be prevented
  const xssVectors = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '<svg onload=alert("XSS")>',
    '<body onload=alert("XSS")>',
    "<iframe src=\"javascript:alert('XSS')\">",
    "<a href=\"javascript:alert('XSS')\">click</a>",
    '"><script>alert("XSS")</script>',
    "'-alert('XSS')-'",
    "<div style=\"background:url(javascript:alert('XSS'))\">",
    '<math><maction xlink:href="javascript:alert(1)">click</maction></math>',
  ];

  test.each(xssVectors)("escapeHtml prevents: %s", (vector) => {
    const result = escapeHtml(vector);
    expect(result).not.toContain("<script");
    expect(result).not.toMatch(/<[a-z]/i);
  });

  test.each(xssVectors)("sanitizeText neutralizes: %s", (vector) => {
    const result = sanitizeText(vector);
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
  });
});
