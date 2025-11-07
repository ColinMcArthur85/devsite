// UI Badge component (ESM)
// Mirrors behavior of the legacy IIFE-based UIComponents.createBadge

/**
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

/**
 * @typedef {Object} BadgeOptions
 * @property {string} [text]
 * @property {string} [classes]
 * @property {string} [variant]
 * @property {"solid"|"ghost"} [appearance]
 */

/**
 * Create a badge <span> element.
 * @param {BadgeOptions} param0
 * @returns {HTMLSpanElement}
 */
export function createBadge({ text = "", classes = "", variant, appearance = "solid" } = {}) {
  const span = document.createElement("span");
  const computedVariant = variant || (text ? slugify(text) : "");

  span.classList.add("badge");

  if (classes) {
    classes
      .split(" ")
      .filter(Boolean)
      .forEach((cls) => span.classList.add(cls));
  }

  if (computedVariant) {
    span.dataset.variant = computedVariant;
    span.classList.add(`badge--${computedVariant}`);
  }

  if (appearance === "ghost") {
    span.classList.add("badge--ghost");
  }

  if (text) {
    span.textContent = text;
  }

  return span;
}
