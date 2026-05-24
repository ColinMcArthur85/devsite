import { skillsConfig } from "../config/skills-config.js";
import { escapeHtml } from "../utils/sanitize.js";

function renderCardHtml(key, config) {
  // Create title HTML (supporting gradients if marked)
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

  // Map completed milestone checkmarks
  const completedHtml = (config.completedMilestones || [])
    .map(
      (item) => `
      <li class="flex items-start gap-2.5 text-xs text-neutral-800 dark:text-neutral-200">
        <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
          <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span class="leading-normal font-medium">${escapeHtml(item)}</span>
      </li>
    `
    )
    .join("");

  // Map next milestones (growth roadmap goals)
  const nextHtml = (config.nextMilestones || [])
    .map(
      (item) => `
      <li class="flex items-start gap-2.5 text-xs text-neutral-500 dark:text-neutral-400">
        <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-dashed border-neutral-400 dark:border-neutral-600 bg-transparent text-neutral-400 dark:text-neutral-500">
          <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
        <span class="leading-normal italic font-light">${escapeHtml(item)} (Goal)</span>
      </li>
    `
    )
    .join("");

  // Highlight the AI Orchestration card with a custom glowing border/halo
  const cardClasses = key === "AIOrchestration" 
    ? "primary-card relative overflow-hidden border border-purple-500/30 bg-slate-950/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] dark:bg-slate-900/40"
    : "primary-card";

  const glowingHalo = key === "AIOrchestration"
    ? `<div class="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-500/10 blur-xl pointer-events-none"></div>`
    : "";

  return `
    <div class="${cardClasses}" data-skill="${key}">
      ${glowingHalo}
      <div class="card-icon shrink-0 relative z-10" style="background-color: color-mix(in srgb, ${config.color} 15%, transparent)">
        <svg ${config.icon === "typescript" ? 'id="typescript"' : ""} class="boop icon-xl" style="color: ${config.color}" aria-hidden="true" focusable="false">
          <use href="./assets/icons/sprite.svg#${config.icon}"></use>
        </svg>
      </div>
      <div class="relative z-10">
        ${titleHtml}
        <p class="card-body text-sm text-neutral-800 dark:text-neutral-200 mt-1 mb-4">${escapeHtml(config.description || "")}</p>
        
        <div class="border-t border-neutral-200/50 dark:border-white/5 pt-3 mt-3">
          <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-2">Checkpoints & Roadmap</p>
          <ul class="flex flex-col gap-2.5">
            ${completedHtml}
            ${nextHtml}
          </ul>
        </div>
      </div>
    </div>
  `;
}

export function renderSkills() {
  // Render core languages/skills (non-frameworks)
  const skillsContainer = document.querySelector("#skills .grid");
  if (skillsContainer) {
    skillsContainer.innerHTML = Object.entries(skillsConfig)
      .filter(([_, config]) => !config.isFramework)
      .map(([key, config]) => renderCardHtml(key, config))
      .join("");
  }

  // Render frameworks/libraries
  const frameworksContainer = document.querySelector("#frameworks .grid");
  if (frameworksContainer) {
    frameworksContainer.innerHTML = Object.entries(skillsConfig)
      .filter(([_, config]) => config.isFramework)
      .map(([key, config]) => renderCardHtml(key, config))
      .join("");
  }
}

// Auto-init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderSkills);
} else {
  renderSkills();
}
