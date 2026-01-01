import features from "../../data/features.json";
import { escapeHtml } from "../utils/sanitize.js";

export function renderFeatures() {
  const container = document.querySelector("#features .grid");
  if (!container) return;

  container.innerHTML = features
    .map(
      (feature) => `
    <div class="primary-card">
      <div class="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-secondary/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-white shadow-lg">
        <svg class="boop icon-lg" aria-hidden="true" focusable="false">
          <use href="./assets/icons/sprite.svg#${feature.icon}"></use>
        </svg>
      </div>
      <h3 class="relative z-10 mt-6 text-xl font-semibold text-gray-900 dark:text-white">${escapeHtml(feature.title)}</h3>
      <p class="relative z-10 mt-3 text-sm leading-relaxed text-gray-600 dark:gray-300">
        ${escapeHtml(feature.description)}
      </p>
    </div>
  `,
    )
    .join("");
}

// Auto-init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderFeatures);
} else {
  renderFeatures();
}
