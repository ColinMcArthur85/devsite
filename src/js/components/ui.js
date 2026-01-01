const RESERVED_BUTTON_DATA = new Set(["button", "text", "href", "classes", "type", "html"]);
const RESERVED_BADGE_DATA = new Set(["badge", "text", "classes", "variant", "appearance"]);

function slugify(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function createButton({ text = "", href = "", classes = "", type = "button", onClick = null, html = "" }) {
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

import { TAG_COLORS } from "../config/color-config.js";

export function createBadge({ text = "", classes = "", variant, appearance = "solid" }) {
  const span = document.createElement("span");
  const computedVariant = variant || (text ? slugify(text) : "");

  span.classList.add("badge");
  if (classes) {
    classes
      .split(" ")
      .filter(Boolean)
      .forEach((cls) => span.classList.add(cls));
  }

  // Color logic
  const key = text.toLowerCase();
  const colorVar = TAG_COLORS[key] || TAG_COLORS[computedVariant];

  if (colorVar) {
    if (appearance === "ghost") {
      span.style.color = colorVar;
      span.style.borderColor = colorVar;
      span.style.backgroundColor = `color-mix(in srgb, ${colorVar} 10%, transparent)`;
    } else {
      // Solid
      span.style.backgroundColor = colorVar;
      // Adjust text color based on brightness if needed, or stick to white for solid
      // For brighter colors like JS (yellow) or CSS Battle (yellow), we might need dark text.
      if (["javascript", "js", "css battle", "css-battle"].includes(key) || colorVar.includes("yellow")) {
        span.style.color = "#000";
      } else {
        span.style.color = "#fff";
      }
    }
  } else {
    // Fallback classes if no specific color found
    if (computedVariant) {
      span.dataset.variant = computedVariant;
      span.classList.add(`badge--${computedVariant}`);
    }
  }

  if (appearance === "ghost") {
    span.classList.add("badge--ghost");
  }

  if (text) {
    span.textContent = text;
  }

  return span;
}

function transferDataset(source, target, reservedKeys) {
  Object.keys(source.dataset).forEach((key) => {
    if (!reservedKeys.has(key)) {
      target.dataset[key] = source.dataset[key];
    }
  });
}

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

// Auto-init on load
document.addEventListener("DOMContentLoaded", initComponents);

// Keep global for backward compatibility if needed, but prefer imports
window.UIComponents = { createButton, createBadge };
