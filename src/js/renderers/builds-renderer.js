import builds from "../../data/builds.json";
import { escapeHtml } from "../utils/sanitize.js";

export function renderBuilds() {
  const container = document.querySelector("#builds .grid");
  if (!container) return;

  container.innerHTML = builds
    .map(
      (build) => `
    <article class="primary-card flex flex-col">
      <div class="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-white shadow-lg">
        <svg class="boop icon-lg" aria-hidden="true" focusable="false">
          <use href="./assets/icons/sprite.svg#${escapeHtml(build.icon)}"></use>
        </svg>
      </div>
      <h3 class="relative z-10 mt-6 text-xl font-semibold text-gray-900 dark:text-white">${escapeHtml(build.title)}</h3>
      <p class="relative z-10 mt-3 grow text-sm leading-relaxed text-gray-600 dark:text-gray-300">${escapeHtml(build.description)}</p>
      <ul class="relative z-10 mt-6 flex flex-wrap gap-2" aria-label="Technologies">
        ${(build.tags || [])
          .map(
            (tag) =>
              `<li class="rounded-full border border-light-border bg-light-background-secondary px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">${escapeHtml(tag)}</li>`,
          )
          .join("")}
      </ul>
    </article>
  `,
    )
    .join("");
}

// Auto-init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderBuilds);
} else {
  renderBuilds();
}
