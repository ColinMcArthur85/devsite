/**
 * Unsplash API Security Tests
 *
 * TDD: RED Phase - Comprehensive tests for API hardening
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
const devVarsPath = path.resolve(process.cwd(), ".dev.vars");
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(devVarsPath)) {
  dotenv.config({ path: devVarsPath });
} else if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

// Import the API handler functions we'll create
// Note: For Cloudflare Workers, we'll test the helper functions
const { validateQuery, validatePagination, sanitizeErrorMessage, getCorsHeaders, isAllowedOrigin } = require("./unsplash-helpers");

describe("Environment Variables", () => {
  test("UNSPLASH_ACCESS_KEY should be defined locally", () => {
    expect(process.env.UNSPLASH_ACCESS_KEY).toBeDefined();
  });
});

describe("Input Validation - validateQuery", () => {
  test("accepts valid alphanumeric queries", () => {
    expect(validateQuery("nature")).toEqual({ valid: true, sanitized: "nature" });
    expect(validateQuery("mountain landscape")).toEqual({ valid: true, sanitized: "mountain landscape" });
  });

  test("rejects empty queries", () => {
    expect(validateQuery("")).toEqual({ valid: false, error: "Query is required" });
    expect(validateQuery(null)).toEqual({ valid: false, error: "Query is required" });
    expect(validateQuery(undefined)).toEqual({ valid: false, error: "Query is required" });
  });

  test("rejects queries that are too long", () => {
    const longQuery = "a".repeat(201);
    expect(validateQuery(longQuery)).toEqual({ valid: false, error: "Query too long (max 200 characters)" });
  });

  test("strips HTML tags from queries", () => {
    expect(validateQuery('<script>alert("xss")</script>nature')).toEqual({
      valid: true,
      sanitized: "nature",
    });
  });

  test("handles special characters safely", () => {
    expect(validateQuery("café & restaurant")).toEqual({
      valid: true,
      sanitized: "café & restaurant",
    });
  });
});

describe("Input Validation - validatePagination", () => {
  test("accepts valid page numbers", () => {
    expect(validatePagination("1", "12")).toEqual({ valid: true, page: 1, perPage: 12 });
    expect(validatePagination("5", "24")).toEqual({ valid: true, page: 5, perPage: 24 });
  });

  test("defaults to page 1 and 12 per page", () => {
    expect(validatePagination(null, null)).toEqual({ valid: true, page: 1, perPage: 12 });
    expect(validatePagination(undefined, undefined)).toEqual({ valid: true, page: 1, perPage: 12 });
  });

  test("rejects non-numeric page values", () => {
    expect(validatePagination("abc", "12")).toEqual({ valid: false, error: "Invalid page number" });
  });

  test("rejects negative page numbers", () => {
    expect(validatePagination("-1", "12")).toEqual({ valid: false, error: "Invalid page number" });
  });

  test("limits per_page to maximum of 30", () => {
    expect(validatePagination("1", "100")).toEqual({ valid: true, page: 1, perPage: 30 });
  });

  test("limits page to maximum of 100", () => {
    expect(validatePagination("500", "12")).toEqual({ valid: true, page: 100, perPage: 12 });
  });
});

describe("Error Handling - sanitizeErrorMessage", () => {
  test("returns generic message for internal errors", () => {
    expect(sanitizeErrorMessage("ECONNREFUSED 127.0.0.1:5432")).toBe("An error occurred processing your request");
  });

  test("returns generic message for stack traces", () => {
    const stackTrace = "Error: Something failed\n    at Object.<anonymous> (/path/to/file.js:10:15)";
    expect(sanitizeErrorMessage(stackTrace)).toBe("An error occurred processing your request");
  });

  test("strips sensitive paths from errors", () => {
    expect(sanitizeErrorMessage("Error at /home/user/project/secret.js")).toBe("An error occurred processing your request");
  });

  test("allows safe error messages through", () => {
    expect(sanitizeErrorMessage("Query is required")).toBe("Query is required");
    expect(sanitizeErrorMessage("Invalid page number")).toBe("Invalid page number");
  });
});

describe("CORS Headers - getCorsHeaders", () => {
  test("returns correct headers for allowed origin in production", () => {
    const headers = getCorsHeaders("https://colinmcarthur.dev", "production");
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://colinmcarthur.dev");
    expect(headers["Access-Control-Allow-Methods"]).toBe("GET, OPTIONS");
    expect(headers["Access-Control-Allow-Headers"]).toBe("Content-Type");
  });

  test("returns localhost origin in development", () => {
    const headers = getCorsHeaders("http://localhost:5173", "development");
    expect(headers["Access-Control-Allow-Origin"]).toBe("http://localhost:5173");
  });

  test("returns null origin for disallowed origins", () => {
    const headers = getCorsHeaders("https://evil.com", "production");
    expect(headers["Access-Control-Allow-Origin"]).toBe("null");
  });
});

describe("CORS - isAllowedOrigin", () => {
  test("allows production domain", () => {
    expect(isAllowedOrigin("https://colinmcarthur.dev", "production")).toBe(true);
    expect(isAllowedOrigin("https://www.colinmcarthur.dev", "production")).toBe(true);
  });

  test("allows localhost in development", () => {
    expect(isAllowedOrigin("http://localhost:5173", "development")).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:5173", "development")).toBe(true);
  });

  test("blocks localhost in production", () => {
    expect(isAllowedOrigin("http://localhost:5173", "production")).toBe(false);
  });

  test("blocks unknown origins", () => {
    expect(isAllowedOrigin("https://malicious-site.com", "production")).toBe(false);
    expect(isAllowedOrigin("https://malicious-site.com", "development")).toBe(false);
  });
});

describe("Security Headers", () => {
  test("response includes security headers", () => {
    const headers = getCorsHeaders("https://colinmcarthur.dev", "production");
    // These should be added to every response
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
  });
});
