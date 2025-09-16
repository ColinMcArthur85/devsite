document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("project-list");
  const paginationContainer = document.getElementById("pagination");
  const techFilterContainer = document.getElementById("filter-tech");
  const categoryFilterContainer = document.getElementById("filter-category");
  const resultsCount = document.getElementById("results-count");

  const storageKey = "projectFilters";
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (e) {
    stored = {};
  }

  const selectedTech = new Set(stored.tech || []);
  const selectedCategories = new Set(stored.categories || []);

  function saveFilters() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          tech: [...selectedTech],
          categories: [...selectedCategories],
        }),
      );
    } catch (e) {}
  }

  fetch("../data/projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const categories = [...new Set(projects.map((p) => p.category))];
      const techs = [...new Set(projects.flatMap((p) => p.tags))];

      renderFilters(
        categoryFilterContainer,
        categories,
        selectedCategories,
        applyFilters,
      );
      renderFilters(techFilterContainer, techs, selectedTech, applyFilters);

      let filtered = [];
      let currentPage = 1;
      const perPage = 6;

      function applyFilters() {
        if (selectedCategories.size === 0 && selectedTech.size === 0) {
          filtered = [];
          if (resultsCount) resultsCount.textContent = "";
        } else {
          filtered = projects.filter(
            (p) =>
              (selectedCategories.size === 0 || selectedCategories.has(p.category)) &&
              (selectedTech.size === 0 || [...selectedTech].some((t) => p.tags.includes(t))),
          );
          if (resultsCount)
            resultsCount.textContent = `${filtered.length} project${filtered.length === 1 ? "" : "s"} found`;
        }
        currentPage = 1;
        renderPage();
      }

      function renderPage() {
        const oldCards = [...listContainer.children];
        if (oldCards.length) {
          oldCards.forEach((card) => card.classList.add("opacity-0", "translate-y-4"));
        }

        setTimeout(
          () => {
            listContainer.innerHTML = "";
            const start = (currentPage - 1) * perPage;
            const pageProjects = filtered.slice(start, start + perPage);
            if (pageProjects.length === 0) {
              const msg = document.createElement("div");
              msg.className = "card p-8 text-center text-slate-600 dark:text-slate-300";
              msg.innerHTML = `
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">${
                  selectedCategories.size === 0 && selectedTech.size === 0
                    ? "Choose a filter to curate the feed"
                    : "No missions match those filters"
                }</h3>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Adjust your selections or clear filters to explore the full archive.</p>
              `;
              listContainer.appendChild(msg);
            } else {
              pageProjects.forEach((project) => {
                const card = buildProjectCard(project);
                listContainer.appendChild(card);
                requestAnimationFrame(() => {
                  card.classList.remove("opacity-0", "translate-y-4");
                });
              });
              renderPagination();
            }
          },
          oldCards.length ? 300 : 0,
        );
      }

      function renderPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filtered.length / perPage);
        if (totalPages <= 1) return;

        const prev = UIComponents.createButton({ text: "Prev", classes: "btn-secondary" });
        prev.disabled = currentPage === 1;
        if (prev.disabled) prev.classList.add("opacity-50", "cursor-not-allowed", "hover:translate-y-0");
        prev.addEventListener("click", () => {
          if (currentPage > 1) {
            currentPage--;
            renderPage();
          }
        });

        const next = UIComponents.createButton({ text: "Next", classes: "btn-secondary" });
        next.disabled = currentPage === totalPages;
        if (next.disabled) next.classList.add("opacity-50", "cursor-not-allowed", "hover:translate-y-0");
        next.addEventListener("click", () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderPage();
          }
        });

        const info = document.createElement("span");
        info.textContent = `Page ${currentPage} of ${totalPages}`;
        info.className = "rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-slate-300";

        paginationContainer.append(prev, info, next);
      }

      applyFilters();
    });

  function renderFilters(container, items, set, onChange) {
    items.forEach((item) => {
      const isActive = set.has(item);
      const badge = UIComponents.createBadge({ text: item });
      badge.classList.add(
        "cursor-pointer",
        "transition-all",
        "duration-300",
        "hover:-translate-y-1",
        "hover:shadow-xl",
        "px-4",
        "py-2",
        "text-[0.65rem]",
      );
      if (isActive) {
        badge.classList.add("bg-gradient-to-r", "from-primary", "to-secondary", "text-white", "border-transparent", "shadow-lg");
        badge.classList.remove("opacity-60");
      } else {
        badge.classList.add("bg-white/10", "border-white/20", "text-slate-500", "dark:text-slate-300", "opacity-70");
      }
      badge.setAttribute("aria-pressed", isActive ? "true" : "false");
      badge.addEventListener("click", () => {
        if (set.has(item)) {
          set.delete(item);
          badge.classList.add("opacity-70", "bg-white/10", "border-white/20", "text-slate-500", "dark:text-slate-300");
          badge.classList.remove("bg-gradient-to-r", "from-primary", "to-secondary", "text-white", "border-transparent", "shadow-lg");
          badge.setAttribute("aria-pressed", "false");
        } else {
          set.add(item);
          badge.classList.remove("opacity-70", "bg-white/10", "border-white/20", "text-slate-500", "dark:text-slate-300");
          badge.classList.add("bg-gradient-to-r", "from-primary", "to-secondary", "text-white", "border-transparent", "shadow-lg");
          badge.setAttribute("aria-pressed", "true");
        }
        saveFilters();
        onChange();
      });
      container.appendChild(badge);
    });
  }

  function buildProjectCard(project) {
    const card = document.createElement("div");
    card.className = "project-card group card card-hoverable card-shadow overflow-hidden p-0 flex flex-col transition duration-500 opacity-0 translate-y-4";
    card.dataset.tags = project.tags.join(",");

    card.innerHTML = `
      <div class="relative h-56 overflow-hidden">
        <img src="${project.image}" loading="lazy" alt="${project.title}" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-tr from-slate-950/55 via-slate-900/10 to-transparent opacity-70 transition duration-500 group-hover:opacity-90"></div>
        <div class="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm">${project.category}</div>
      </div>
      <div class="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-white">${project.title}</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${project.description}</p>
        </div>
        <div class="badge-container flex flex-wrap gap-2"></div>
        <div class="mt-auto flex items-center justify-between gap-3">
          <div class="btn-container flex gap-3"></div>
          <a href="${project.code}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition-colors duration-300 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
            <i class="fa-brands fa-github text-sm"></i>
            Code
          </a>
        </div>
      </div>`;

    const badgeContainer = card.querySelector(".badge-container");
    project.tags.forEach((tag) => {
      const badge = UIComponents.createBadge({ text: tag });
      badgeContainer.appendChild(badge);
    });

    const btnContainer = card.querySelector(".btn-container");
    const viewBtn = UIComponents.createButton({ text: "View project", href: project.live, classes: "btn-sm-primary" });
    btnContainer.append(viewBtn);

    return card;
  }
});