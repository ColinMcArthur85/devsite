import skills from "../../data/skills.json";
import { skillsConfig } from "../config/skills-config.js";
import { createBadge } from "../components/ui.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderSkills() {
  // Manual stats for external projects (e.g. Timesheet Tracker)
  const externalStats = {
    HTML: 200,
    CSS: 500,
    JavaScript: 10000, 
    TypeScript: 5000,
    MySQL: 500, 
    React: 5000,
    Python: 3500,
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
      const percent = count > 0 ? Math.min(100, Math.round((count / 25000) * 100)) : 0; 

      // We need to handle the gradient title for gradient skills
      let titleHtml = `<h3 class="card-title ${config.class}" style="color: ${config.color}">${escapeHtml(config.title)}</h3>`;
      if (config.isGradient) {
        let firstPart, lastPart;
        if (key === "MySQL") {
          firstPart = "My";
          lastPart = "SQL";
        } else if (key === "Python") {
          firstPart = "Py";
          lastPart = "thon";
        } else {
          firstPart = config.title.slice(0, Math.floor(config.title.length / 2));
          lastPart = config.title.slice(firstPart.length);
        }

        titleHtml = `<h3 class="card-title ${config.class}">
        <span style="color: ${config.color}">${escapeHtml(firstPart)}</span>
        <span style="color: ${config.colorEnd}">${escapeHtml(lastPart)}</span>
      </h3>`;
      }

      // Progress bar gradient
      const progressStyle = `background: linear-gradient(to right, ${config.color}, ${config.colorEnd || config.color + "99%"}); width: ${percent}%`;

      // Badge HTML
      const badgeHtml = config.badge ? `<span data-badge="${escapeHtml(config.badge)}"></span>` : "";

      return `
      <div class="primary-card" data-skill="${key}">
        <div class="card-icon shrink-0" style="background-color: color-mix(in srgb, ${config.color} 15%, transparent)">
          <svg ${config.icon === "typescript" ? 'id="typescript"' : ""} class="boop icon-xl" style="color: ${config.color}" aria-hidden="true" focusable="false">
            <use href="./assets/icons/sprite.svg#${config.icon}"></use>
          </svg>
        </div>
        ${titleHtml}
        <p class="card-body text-sm text-neutral-800 dark:text-neutral-200 mt-1 mb-4">${escapeHtml(config.description || "")}</p>

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
