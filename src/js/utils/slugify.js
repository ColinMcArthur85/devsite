/**
 * Convert a string to a URL-friendly slug
 * @param {string} [value]
 * @returns {string}
 */
export function slugify(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
