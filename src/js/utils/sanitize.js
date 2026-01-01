/**
 * Sanitization Utility Functions
 *
 * Security utilities for preventing XSS and other injection attacks.
 * All functions handle null/undefined gracefully by returning empty strings.
 */

/**
 * Escapes HTML special characters to prevent XSS attacks.
 * Use this when displaying user input in HTML context.
 *
 * @param {string|number|null|undefined} str - The string to escape
 * @returns {string} The escaped string, safe for HTML insertion
 *
 * @example
 * escapeHtml('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
function escapeHtml(str) {
  if (str === null || str === undefined) {
    return "";
  }

  // Convert to string if not already (handles numbers, etc.)
  const text = String(str);

  // Map of characters to their HTML entity equivalents
  const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };

  // Replace each special character with its entity
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

/**
 * Strips all HTML tags from a string.
 * Use this to extract plain text from HTML content.
 *
 * @param {string|null|undefined} str - The string to strip tags from
 * @returns {string} The string with all HTML tags removed
 *
 * @example
 * stripTags('<p>Hello <strong>World</strong></p>')
 * // Returns: 'Hello World'
 */
function stripTags(str) {
  if (str === null || str === undefined) {
    return "";
  }

  const text = String(str);

  // First, remove script and style elements entirely (including content)
  let result = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Then remove all remaining HTML tags
  result = result.replace(/<[^>]*>/g, "");

  return result;
}

/**
 * Sanitizes a string for safe use in URLs.
 * Blocks dangerous protocols like javascript: and data:
 *
 * @param {string|null|undefined} str - The URL string to sanitize
 * @returns {string} The sanitized URL, or empty string if dangerous
 *
 * @example
 * sanitizeForUrl('javascript:alert(1)')
 * // Returns: ''
 *
 * sanitizeForUrl('https://example.com')
 * // Returns: 'https://example.com'
 */
function sanitizeForUrl(str) {
  if (str === null || str === undefined) {
    return "";
  }

  const text = String(str).trim();

  // Check for dangerous protocols (case-insensitive)
  const lowerText = text.toLowerCase();
  const dangerousProtocols = ["javascript:", "data:", "vbscript:"];

  for (const protocol of dangerousProtocols) {
    if (lowerText.startsWith(protocol)) {
      return "";
    }
  }

  // For safe URLs, encode spaces but preserve the rest
  // (relative URLs and http/https are allowed)
  return text.replace(/ /g, "%20");
}

/**
 * Combines stripTags and escapeHtml for maximum safety.
 * Use this for user-generated content that will be displayed as text.
 *
 * @param {string|null|undefined} str - The string to sanitize
 * @returns {string} The fully sanitized string
 *
 * @example
 * sanitizeText('<script>alert("xss")</script>')
 * // Returns: ''
 *
 * sanitizeText('<p>Tom & Jerry</p>')
 * // Returns: 'Tom &amp; Jerry'
 */
function sanitizeText(str) {
  if (str === null || str === undefined) {
    return "";
  }

  // First strip all HTML tags, then escape any remaining special chars
  return escapeHtml(stripTags(str));
}

// Export functions for use in other modules
export { escapeHtml, stripTags, sanitizeForUrl, sanitizeText };
