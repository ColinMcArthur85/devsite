import { skillsConfig } from "./config/skills-config.js";
import { escapeHtml } from "./utils/sanitize.js";

document.addEventListener("DOMContentLoaded", () => {
  // Update skills checklist inside cards
  Object.entries(skillsConfig).forEach(([key, config]) => {
    let card = document.querySelector(`[data-skill="${key}"]`);

    // If the card doesn't exist (like the new AI Orchestration card), let's dynamically append it!
    if (!card) {
      const gridContainer = document.querySelector("#hero + section .container-wrapper > .grid");
      if (gridContainer) {
        const cardClasses = key === "AIOrchestration" 
          ? "primary-card p-8 relative overflow-hidden border border-purple-500/30 bg-slate-950/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] dark:bg-slate-900/40"
          : "primary-card p-8";

        const glowingHalo = key === "AIOrchestration"
          ? `<div class="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-500/10 blur-xl pointer-events-none"></div>`
          : "";

        const newArticle = document.createElement("article");
        newArticle.className = cardClasses;
        newArticle.setAttribute("data-skill", key);
        newArticle.innerHTML = `
          ${glowingHalo}
          <div class="flex items-center gap-4 relative z-10">
            <div class="card-icon shrink-0" style="background-color: color-mix(in srgb, ${config.color} 15%, transparent)">
              <svg class="boop icon-xl" style="color: ${config.color}" aria-hidden="true" focusable="false">
                <use href="../assets/icons/sprite.svg#${config.icon}"></use>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold ${config.class || ""}" style="color: ${config.color}">${escapeHtml(config.title)}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Force multiplying system design & diagnostics</p>
            </div>
          </div>
          <div class="mt-6 space-y-3 relative z-10"></div>
        `;
        gridContainer.appendChild(newArticle);
        card = newArticle;
      }
    }

    if (card) {
      // Find the progress-bar block container and replace it with a clean checklist
      const progressContainer = card.querySelector(".mt-6.space-y-3");
      if (progressContainer) {
        // Strip off any old 'Coming Soon' badges
        const badge = card.querySelector("[data-badge='Coming Soon']");
        if (badge) {
          badge.remove();
        }

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

        progressContainer.innerHTML = `
          <div class="border-t border-neutral-200/50 dark:border-white/5 pt-3">
            <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-2">Checkpoints & Roadmap</p>
            <ul class="flex flex-col gap-2.5">
              ${completedHtml}
              ${nextHtml}
            </ul>
          </div>
        `;
      }
    }
  });

  // Calculate simulated line summaries or total counts (let's keep the hero totals functioning dynamically!)
  const basePath = window.location.pathname.includes("/pages/") ? "../" : "./";
  fetch(`${basePath}data/skills.json`)
    .then((res) => res.json())
    .then((rawSkills) => {
      const summary = document.getElementById("skill-summary");
      if (summary) {
        summary.innerHTML = "";
        
        // Evolve summary panel: list core focus tags instead of bar chart percentages
        const focusItems = [
          { tag: "System Design", level: "Production-Grade", desc: "Clean MVC, database constraints, state management." },
          { tag: "Orchestrated Ops", level: "Senior Workflow", desc: "TDD Jest frameworks, bug diagnostics using Rollbar, CI/CD reviews." },
          { tag: "Backend Security", level: "OWASP Hardened", desc: "Prepared statements, XSS escaping, CORS filtering." }
        ];

        focusItems.forEach(item => {
          const row = document.createElement("div");
          row.className = "py-3 border-b border-neutral-200/50 dark:border-white/5 last:border-0";
          row.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-neutral-900 dark:text-white">${escapeHtml(item.tag)}</span>
              <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20">${escapeHtml(item.level)}</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${escapeHtml(item.desc)}</p>
          `;
          summary.appendChild(row);
        });
      }
    })
    .catch(console.error);
});
