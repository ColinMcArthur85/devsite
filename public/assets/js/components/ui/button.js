// UI Button component (ESM)
// Mirrors behavior of the legacy IIFE-based UIComponents.createButton

/**
 * @typedef {Object} ButtonOptions
 * @property {string} [text]
 * @property {string} [href]
 * @property {string} [classes]
 * @property {"button"|"submit"|"reset"} [type]
 * @property {Function|null} [onClick]
 * @property {string} [html]
 */

/**
 * Create a button or anchor element based on options.
 * @param {ButtonOptions} param0
 * @returns {HTMLButtonElement|HTMLAnchorElement}
 */
export function createButton({ text = "", href = "", classes = "", type = "button", onClick = null, html = "" } = {}) {
  const element = href ? document.createElement("a") : document.createElement("button");

  if (href) {
    element.href = href;
  } else {
    element.type = type;
  }

  if (text) {
    element.textContent = text;
  } else if (html) {
    element.innerHTML = html;
  }

  if (classes) {
    element.className = classes;
  }

  if (typeof onClick === "function") {
    element.addEventListener("click", onClick);
  }

  return element;
}
