/**
 * Unsplash API Helper Functions
 *
 * Security utilities for the Unsplash API proxy.
 * These functions are testable independently of the Cloudflare Worker runtime.
 */

/**
 * Validates and sanitizes a search query.
 *
 * @param {string|null|undefined} query - The search query to validate
 * @returns {Object} Result with valid flag and sanitized query or error
 */
function validateQuery(query) {
  // Check for empty/null/undefined
  if (!query || query.trim() === "") {
    return { valid: false, error: "Query is required" };
  }

  // Convert to string and trim
  let sanitized = String(query).trim();

  // Check length before sanitization
  if (sanitized.length > 200) {
    return { valid: false, error: "Query too long (max 200 characters)" };
  }

  // Strip script/style tags and their content first
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Then strip remaining HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // If stripping tags leaves empty string, that's still invalid
  if (sanitized.trim() === "") {
    return { valid: false, error: "Query is required" };
  }

  return { valid: true, sanitized: sanitized.trim() };
}

/**
 * Validates and normalizes pagination parameters.
 *
 * @param {string|null|undefined} page - The page number
 * @param {string|null|undefined} perPage - Results per page
 * @returns {Object} Result with valid flag and normalized values or error
 */
function validatePagination(page, perPage) {
  // Defaults
  let pageNum = 1;
  let perPageNum = 12;

  // Parse page if provided
  if (page !== null && page !== undefined) {
    pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return { valid: false, error: "Invalid page number" };
    }
    // Cap at 100 pages
    pageNum = Math.min(pageNum, 100);
  }

  // Parse perPage if provided
  if (perPage !== null && perPage !== undefined) {
    perPageNum = parseInt(perPage, 10);
    if (isNaN(perPageNum) || perPageNum < 1) {
      perPageNum = 12; // Default on invalid
    }
    // Cap at 30 (Unsplash API limit)
    perPageNum = Math.min(perPageNum, 30);
  }

  return { valid: true, page: pageNum, perPage: perPageNum };
}

/**
 * Sanitizes error messages to prevent information leakage.
 *
 * @param {string} message - The error message to sanitize
 * @returns {string} Safe error message for client
 */
function sanitizeErrorMessage(message) {
  if (!message) {
    return "An error occurred processing your request";
  }

  const safeMessage = String(message);

  // List of safe, known error messages that can pass through
  const safeMessages = ["Query is required", "Query too long (max 200 characters)", "Invalid page number", "Invalid per_page value", "Rate limit exceeded"];

  if (safeMessages.includes(safeMessage)) {
    return safeMessage;
  }

  // Check for sensitive patterns
  const sensitivePatterns = [
    /\/[a-zA-Z0-9_\-./]+\.(js|ts|json)/i, // File paths
    /at\s+\w+\s+\(/, // Stack traces
    /ECONNREFUSED|ETIMEDOUT|ENOTFOUND/, // Network errors
    /127\.0\.0\.1|localhost/i, // Internal addresses
    /password|secret|key|token/i, // Secrets
    /\n/, // Multi-line (stack traces)
  ];

  for (const pattern of sensitivePatterns) {
    if (pattern.test(safeMessage)) {
      return "An error occurred processing your request";
    }
  }

  return "An error occurred processing your request";
}

/**
 * Checks if an origin is allowed for CORS.
 *
 * @param {string} origin - The request origin
 * @param {string} environment - 'production' or 'development'
 * @returns {boolean} Whether the origin is allowed
 */
function isAllowedOrigin(origin, environment) {
  if (!origin) return false;

  // Production allowed origins
  const productionOrigins = ["https://colinmcarthur.dev", "https://www.colinmcarthur.dev"];

  // Development/Preview allowed origins
  const developmentOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8788",
    "http://127.0.0.1:8788",
  ];

  if (environment === "production") {
    return productionOrigins.includes(origin);
  }

  // Allow localhost, production origins, and any Cloudflare Pages preview URLs
  return (
    developmentOrigins.includes(origin) ||
    productionOrigins.includes(origin) ||
    origin.endsWith(".pages.dev")
  );
}

/**
 * Generates CORS and security headers for responses.
 *
 * @param {string} origin - The request origin
 * @param {string} environment - 'production' or 'development'
 * @returns {Object} Headers object
 */
function getCorsHeaders(origin, environment) {
  const allowed = isAllowedOrigin(origin, environment);

  return {
    "Access-Control-Allow-Origin": allowed ? origin : "null",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    // Security headers
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}

// Export for testing and use in main API
module.exports = {
  validateQuery,
  validatePagination,
  sanitizeErrorMessage,
  getCorsHeaders,
  isAllowedOrigin,
};
