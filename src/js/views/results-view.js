import { TAG_COLORS } from "../config/color-config.js";
import { createButton, createBadge } from "../components/ui.js";
import { escapeHtml, sanitizeForUrl } from "../utils/sanitize.js";

const PAGE_SIZE = 6;

export function ResultsView(listContainer, paginationContainer, resultsCountEl) {
  let currentPage = 1;
  let filteredProjects = [];
  let hasActiveFilters = false;

  function updateResultsCount() {
    if (!resultsCountEl) return;
    if (!filteredProjects.length) {
      resultsCountEl.textContent = "";
    } else {
      resultsCountEl.textContent = `${filteredProjects.length} project${filteredProjects.length === 1 ? "" : "s"} found`;
    }
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE);
    if (totalPages <= 1) return;

    const createBtn = (label, disabled, onClick) => {
      const button = createButton({ text: label, classes: "btn-secondary" });
      button.disabled = disabled;
      button.classList.toggle("is-disabled", disabled);
      if (!disabled) {
        button.addEventListener("click", onClick);
      }
      return button;
    };

    const prev = createBtn("Prev", currentPage === 1, () => {
      currentPage -= 1;
      renderPage();
    });
    const next = createBtn("Next", currentPage === totalPages, () => {
      currentPage += 1;
      renderPage();
    });

    const info = document.createElement("span");
    info.textContent = `Page ${currentPage} of ${totalPages}`;
    info.className = "pagination__info";

    paginationContainer.append(prev, info, next);
  }

  function renderEmptyState(hasFilters) {
    const wrapper = document.createElement("div");
    wrapper.className = "secondary-card p-8 text-center text-slate-600 dark:text-slate-300";
    wrapper.innerHTML = `
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">${hasFilters ? "No missions match those filters" : "Choose a filter to curate the feed"}</h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Adjust your selections or clear filters to explore the full archive.</p>
    `;
    listContainer.appendChild(wrapper);
  }

  function renderProjects(projects) {
    listContainer.innerHTML = "";
    if (!projects.length) {
      renderEmptyState(hasActiveFilters);
      paginationContainer.innerHTML = "";
      return;
    }

    projects.forEach((project) => {
      const card = document.createElement("div");
      card.className = "project-card group primary-card card-hoverable card-shadow overflow-hidden p-0 flex flex-col transition duration-500 opacity-0 translate-y-4";
      card.dataset.tags = project.tags.join(",");

      // Color logic for category
      const catKey = project.category.toLowerCase();
      const catColor = TAG_COLORS[catKey] || "rgba(255, 255, 255, 0.2)";
      const catStyle = TAG_COLORS[catKey] ? `background-color: ${catColor}; border-color: ${catColor}; color: white;` : "";

      const safeTitle = escapeHtml(project.title);
      const safeDesc = escapeHtml(project.description);
      const safeImage = sanitizeForUrl(project.image);
      const safeCategory = escapeHtml(project.category);
      const safeCodeUrl = sanitizeForUrl(project.code);

      card.innerHTML = `
        <div class="relative h-56 overflow-hidden">
          <img src="${safeImage}" loading="lazy" alt="${safeTitle}" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-linear-to-tr from-slate-950/55 via-slate-900/10 to-transparent opacity-70 transition duration-500 group-hover:opacity-90"></div>
          <div class="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm" style="${catStyle}">${safeCategory}</div>
        </div>
        <div class="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white">${safeTitle}</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${safeDesc}</p>
          </div>
          <div class="badge-container flex flex-wrap gap-2"></div>
          <div class="mt-auto flex items-center justify-between gap-3">
            <div class="btn-container flex gap-3"></div>
            <a href="${safeCodeUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition-colors duration-300 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
              <svg class="icon text-sm" aria-hidden="true" focusable="false">
                <use href="../assets/icons/sprite.svg#github"></use>
              </svg>
              Code
            </a>
          </div>
        </div>`;

      const badgeContainer = card.querySelector(".badge-container");
      project.tags.forEach((tag) => {
        const badge = createBadge({ text: tag });
        badgeContainer.appendChild(badge);
      });

      const btnContainer = card.querySelector(".btn-container");
      const viewBtn = createButton({ text: "View project", href: project.live, classes: "btn-sm-primary" });
      btnContainer.append(viewBtn);

      listContainer.appendChild(card);
      requestAnimationFrame(() => {
        card.classList.remove("opacity-0", "translate-y-4");
      });
    });
  }

  function renderPage() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageProjects = filteredProjects.slice(start, start + PAGE_SIZE);
    renderProjects(pageProjects);
    renderPagination();
  }

  return {
    update(projects) {
      filteredProjects = projects;
      currentPage = 1;
      hasActiveFilters = true;
      updateResultsCount();
      renderPage();
    },
    refresh() {
      updateResultsCount();
      renderPage();
    },
    showEmptyState(hasFilters) {
      filteredProjects = [];
      hasActiveFilters = hasFilters;
      listContainer.innerHTML = "";
      renderEmptyState(hasFilters);
      paginationContainer.innerHTML = "";
      updateResultsCount();
    },
  };
}
