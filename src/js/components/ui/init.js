// UI auto-initializer (ESM)
// Scans for [data-button] and [data-badge] and replaces with created elements

import { createButton } from "./button.js";
import { createBadge } from "./badge.js";

const RESERVED_BUTTON_DATA = new Set(["button", "text", "href", "classes", "type", "html"]);
const RESERVED_BADGE_DATA = new Set(["badge", "text", "classes", "variant", "appearance"]);

/**
 * Copy dataset entries from source to target, excluding reserved keys.
 * @param {HTMLElement} source
 * @param {HTMLElement} target
 * @param {Set<string>} reservedKeys
 */
function transferDataset(source, target, reservedKeys) {
  Object.keys(source.dataset).forEach((key) => {
    if (!reservedKeys.has(key)) {
      target.dataset[key] = source.dataset[key];
    }
  });
}

/**
 * Initialize data-driven UI components in the document.
 */
export function initComponents() {
  document.querySelectorAll("[data-button]").forEach((el) => {
    const options = {
      text: el.dataset.text,
      href: el.dataset.href,
      classes: el.dataset.classes || "btn",
      type: el.dataset.type || "button",
      html: el.innerHTML.trim(),
    };

    const btn = createButton(options);
    transferDataset(el, btn, RESERVED_BUTTON_DATA);
    el.replaceWith(btn);
  });

  document.querySelectorAll("[data-badge]").forEach((el) => {
    const options = {
      text: el.dataset.badge || el.dataset.text || el.textContent,
      classes: el.dataset.classes || "",
      variant: el.dataset.variant,
      appearance: el.dataset.appearance || "solid",
    };

    const badge = createBadge(options);
    transferDataset(el, badge, RESERVED_BADGE_DATA);
    el.replaceWith(badge);
  });
}
