/**
 * API Security Tests
 *
 * Tests for API security features including:
 * - API key protection
 * - Rate limiting
 * - Input validation
 * - CORS security
 * - Error message sanitization
 */

import { validateQuery, validatePagination, sanitizeErrorMessage, getCorsHeaders, isAllowedOrigin } from "../../functions/api/unsplash-helpers.js";

describe("API Security - Key Protection", () => {
  describe("Environment Variables", () => {
    test("UNSPLASH_ACCESS_KEY is not exposed in client code", () => {
      // Check that the key is only accessed server-side
      // In our case, the helpers don't contain the key directly
      const helperCode = require("fs").readFileSync(require("path").join(__dirname, "../../functions/api/unsplash-helpers.js"), "utf8");

      // Should not contain hardcoded API keys
      expect(helperCode).not.toMatch(/UNSPLASH_ACCESS_KEY\s*[=:]\s*['"][^'"]+['"]/);
      expect(helperCode).not.toMatch(/Client-ID\s+[a-zA-Z0-9_-]{20,}/);
    });

    test("API key pattern not present in helper module", () => {
      // Unsplash keys are typically 32+ characters
      const helperCode = require("fs").readFileSync(require("path").join(__dirname, "../../functions/api/unsplash-helpers.js"), "utf8");

      // Should not contain what looks like an API key
      expect(helperCode).not.toMatch(/[a-zA-Z0-9_-]{32,}/);
    });
  });

  describe("Error Messages", () => {
    test("API key not leaked in error messages", () => {
      const errorWithKey = "Error: Invalid API key: abc123secretkey456";
      const sanitized = sanitizeErrorMessage(errorWithKey);

      expect(sanitized).not.toContain("abc123");
      expect(sanitized).not.toContain("secretkey");
    });

    test("Environment variable names not leaked", () => {
      const errorWithEnv = "Error: UNSPLASH_ACCESS_KEY is undefined";
      const sanitized = sanitizeErrorMessage(errorWithEnv);

      // Should return generic message
      expect(sanitized).toBe("An error occurred processing your request");
    });
  });
});

describe("API Security - Rate Limiting", () => {
  describe("Pagination Limits", () => {
    test("page number is capped at 100", () => {
      const result = validatePagination("999", "12");
      expect(result.page).toBe(100);
    });

    test("per_page is capped at 30", () => {
      const result = validatePagination("1", "100");
      expect(result.perPage).toBe(30);
    });

    test("rejects excessively large page numbers", () => {
      // Even though we cap, very large numbers should be handled
      const result = validatePagination("999999999", "12");
      expect(result.page).toBe(100);
    });

    test("handles string manipulation attempts", () => {
      const result = validatePagination("1e10", "12");
      // parseInt('1e10', 10) returns 1, which is valid
      // The 'e10' part is ignored by parseInt
      expect(result.valid).toBe(true);
      expect(result.page).toBe(1);
    });
  });

  describe("Query Limits", () => {
    test("query length is limited to 200 characters", () => {
      const longQuery = "a".repeat(250);
      const result = validateQuery(longQuery);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("too long");
    });

    test("query cannot be empty", () => {
      expect(validateQuery("").valid).toBe(false);
      expect(validateQuery("   ").valid).toBe(false);
      expect(validateQuery(null).valid).toBe(false);
    });
  });
});

describe("API Security - Input Validation", () => {
  describe("SQL Injection Prevention", () => {
    // While we don't use SQL, these patterns should still be handled safely
    const sqlInjectionPatterns = ["'; DROP TABLE users; --", "1 OR 1=1", "1; DELETE FROM photos", "' UNION SELECT * FROM users --", "1' AND '1'='1"];

    sqlInjectionPatterns.forEach((pattern) => {
      test(`handles SQL injection pattern: ${pattern.substring(0, 30)}...`, () => {
        const result = validateQuery(pattern);
        // Should either reject or sanitize - not crash
        expect(result).toBeDefined();
        expect(typeof result.valid).toBe("boolean");
      });
    });
  });

  describe("Command Injection Prevention", () => {
    const commandPatterns = ["$(cat /etc/passwd)", "`cat /etc/passwd`", "| cat /etc/passwd", "; cat /etc/passwd", "&& rm -rf /"];

    commandPatterns.forEach((pattern) => {
      test(`handles command injection pattern: ${pattern}`, () => {
        const result = validateQuery(pattern);
        // Query validation should pass (it's just searching for these terms)
        // but they won't execute anything
        expect(result).toBeDefined();
      });
    });
  });

  describe("Path Traversal Prevention", () => {
    const pathPatterns = ["../../../etc/passwd", "..\\..\\..\\windows\\system32", "%2e%2e%2f%2e%2e%2f", "....//....//....//etc/passwd"];

    pathPatterns.forEach((pattern) => {
      test(`handles path traversal pattern: ${pattern}`, () => {
        const result = validateQuery(pattern);
        // These are valid search queries, just odd ones
        if (result.valid) {
          expect(result.sanitized).toBeDefined();
        }
      });
    });
  });

  describe("NoSQL Injection Prevention", () => {
    const nosqlPatterns = ['{"$gt": ""}', '{"$ne": null}', '{"$where": "this.password.length > 0"}'];

    nosqlPatterns.forEach((pattern) => {
      test(`handles NoSQL injection pattern: ${pattern}`, () => {
        const result = validateQuery(pattern);
        // Should treat as literal string, not JSON
        expect(result).toBeDefined();
      });
    });
  });
});

describe("API Security - CORS", () => {
  describe("Origin Validation", () => {
    test("production allows only whitelisted origins", () => {
      expect(isAllowedOrigin("https://colinmcarthur.dev", "production")).toBe(true);
      expect(isAllowedOrigin("https://www.colinmcarthur.dev", "production")).toBe(true);
      expect(isAllowedOrigin("https://evil.com", "production")).toBe(false);
    });

    test("localhost is blocked in production", () => {
      expect(isAllowedOrigin("http://localhost:5173", "production")).toBe(false);
      expect(isAllowedOrigin("http://localhost:3000", "production")).toBe(false);
      expect(isAllowedOrigin("http://127.0.0.1:5173", "production")).toBe(false);
    });

    test("development allows localhost", () => {
      expect(isAllowedOrigin("http://localhost:5173", "development")).toBe(true);
      expect(isAllowedOrigin("http://localhost:3000", "development")).toBe(true);
    });

    test("null origin is rejected", () => {
      expect(isAllowedOrigin(null, "production")).toBe(false);
      expect(isAllowedOrigin("", "production")).toBe(false);
    });

    test("rejects origin spoofing attempts", () => {
      // Subdomain attacks
      expect(isAllowedOrigin("https://evil.colinmcarthur.dev", "production")).toBe(false);
      expect(isAllowedOrigin("https://colinmcarthur.dev.evil.com", "production")).toBe(false);

      // Protocol downgrade
      expect(isAllowedOrigin("http://colinmcarthur.dev", "production")).toBe(false);
    });
  });

  describe("CORS Headers", () => {
    test("sets Access-Control-Allow-Origin correctly", () => {
      const allowedHeaders = getCorsHeaders("https://colinmcarthur.dev", "production");
      expect(allowedHeaders["Access-Control-Allow-Origin"]).toBe("https://colinmcarthur.dev");

      const blockedHeaders = getCorsHeaders("https://evil.com", "production");
      expect(blockedHeaders["Access-Control-Allow-Origin"]).toBe("null");
    });

    test("restricts allowed methods", () => {
      const headers = getCorsHeaders("https://colinmcarthur.dev", "production");
      expect(headers["Access-Control-Allow-Methods"]).toBe("GET, OPTIONS");
    });

    test("includes security headers", () => {
      const headers = getCorsHeaders("https://colinmcarthur.dev", "production");
      expect(headers["X-Content-Type-Options"]).toBe("nosniff");
      expect(headers["X-Frame-Options"]).toBe("DENY");
    });
  });
});

describe("API Security - Error Handling", () => {
  describe("Stack Trace Prevention", () => {
    test("stack traces are not exposed", () => {
      const stackError = `Error: Something went wrong
    at Object.<anonymous> (/Users/developer/project/src/api.js:42:15)
    at Module._compile (node:internal/modules/cjs/loader:1234:14)
    at node:internal/main/run_main_module:28:49`;

      const sanitized = sanitizeErrorMessage(stackError);

      expect(sanitized).not.toContain("/Users/");
      expect(sanitized).not.toContain("at Object");
      expect(sanitized).not.toContain(".js:");
    });

    test("file paths are not exposed", () => {
      const pathError = "ENOENT: no such file or directory, open '/app/secrets/config.json'";
      const sanitized = sanitizeErrorMessage(pathError);

      expect(sanitized).not.toContain("/app/");
      expect(sanitized).not.toContain("secrets");
    });

    test("network errors are sanitized", () => {
      const networkError = "Error: connect ECONNREFUSED 127.0.0.1:5432";
      const sanitized = sanitizeErrorMessage(networkError);

      expect(sanitized).not.toContain("127.0.0.1");
      expect(sanitized).not.toContain("5432");
    });
  });

  describe("Sensitive Data Protection", () => {
    test("passwords not exposed in errors", () => {
      const pwError = "Authentication failed for password: secret123";
      const sanitized = sanitizeErrorMessage(pwError);

      expect(sanitized).not.toContain("secret123");
      expect(sanitized).not.toContain("password");
    });

    test("tokens not exposed in errors", () => {
      const tokenError = "Invalid token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      const sanitized = sanitizeErrorMessage(tokenError);

      expect(sanitized).not.toContain("eyJ");
      expect(sanitized).not.toContain("token");
    });
  });
});
