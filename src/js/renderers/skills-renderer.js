import skills from "../../data/skills.json";
import { skillsConfig } from "../config/skills-config.js";
import { createBadge } from "../components/ui.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderSkills() {
  // Manual stats for external projects (e.g. Timesheet Tracker)
  const externalStats = {
    HTML: 200,
    CSS: 500,
    JavaScript: 15000, // Next.js + Node logic
    MySQL: 500, // Postgres/SQL logic
    React: 5000,
  };

  const mergedSkills = { ...skills };
  Object.keys(externalStats).forEach((key) => {
    mergedSkills[key] = (mergedSkills[key] || 0) + externalStats[key];
  });

  const container = document.querySelector("#skills .grid");
  if (!container) return;

  container.innerHTML = Object.entries(skillsConfig)
    .map(([key, config]) => {
      if (config.isFramework) return ""; // Skip frameworks if they are in a separate section

      const count = mergedSkills[key] || 0;
      const percent = count > 0 ? Math.min(100, Math.round((count / 25000) * 100)) : 0; // Increased max base for calc
      // The original code might have calculated percentage based on total lines.
      // Let's assume a fixed max or just use the count.
      // The original HTML had "0%" and "0 lines" initially.

      // We need to handle the gradient title for MySQL
      let titleHtml = `<h3 class="card-title ${config.class} text-[${config.color}]">${escapeHtml(config.title)}</h3>`;
      if (config.isGradient) {
        titleHtml = `<h3 class="card-title ${config.class}">
        <span class="text-[${config.color}]">My</span>
        <span class="text-[${config.colorEnd}]">SQL</span>
      </h3>`;
      }

      // Badge
      let badgeHtml = "";
      if (config.badge) {
        badgeHtml = `<span data-badge="${escapeHtml(config.badge)}"></span>`;
      }

      // Progress bar gradient
      // For gradients, we can use style or Tailwind classes if we construct them carefully.
      // Since colors are variables, style is safer for gradients unless we use arbitrary values like from-[var(--c)]
      const progressStyle = `background: linear-gradient(to right, ${config.color}, ${config.colorEnd || config.color + "99%"}); width: ${percent}%`;

      return `
      <div class="primary-card" data-skill="${key}">
        <div class="card-icon" style="background-color: color-mix(in srgb, ${config.color} 15%, transparent)">
          <svg class="boop icon-xl" style="color: ${config.color}" aria-hidden="true" focusable="false">
            <use href="./assets/icons/sprite.svg#${config.icon}"></use>
          </svg>
        </div>
        ${titleHtml}

        <div class="flex items-center gap-2">
          <div class="w-full relative h-4 bg-neutral-800/30 dark:bg-neutral-200/20 rounded-lg overflow-hidden">
            <div
              class="progress-bar-fill absolute left-0 top-0 h-full rounded-lg transition-all duration-1000 ease-in-out"
              style="${progressStyle}"
            ></div>
          </div>
          <span class="progress-percent text-sm text-neutral-800 dark:text-neutral-200 font-mono w-10 text-right">${percent}%</span>
        </div>
        <p class="lines-count text-xs text-neutral-800 dark:text-neutral-200 font-mono mt-1 ${config.badge ? "mb-4" : ""}">${count} lines</p>
        ${badgeHtml}
      </div>
    `;
    })
    .join("");
}

// Auto-init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderSkills);
} else {
  renderSkills();
}
