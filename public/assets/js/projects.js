document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("project-list");
  const paginationContainer = document.getElementById("pagination");
  const techFilterContainer = document.getElementById("filter-tech");
  const categoryFilterContainer = document.getElementById("filter-category");

  const selectedTech = new Set();
  const selectedCategories = new Set();

  fetch("../data/projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const categories = [...new Set(projects.map((p) => p.category))];
      const techs = [...new Set(projects.flatMap((p) => p.tags))];

      renderFilters(categoryFilterContainer, categories, selectedCategories, applyFilters);
      renderFilters(techFilterContainer, techs, selectedTech, applyFilters);

      let filtered = [];
      let currentPage = 1;
      const perPage = 6;

      function applyFilters() {
        if (selectedCategories.size === 0 && selectedTech.size === 0) {
          filtered = [];
        } else {
          filtered = projects.filter((p) => (selectedCategories.size === 0 || selectedCategories.has(p.category)) && (selectedTech.size === 0 || [...selectedTech].every((t) => p.tags.includes(t))));
        }
        currentPage = 1;
        renderPage();
      }

      function renderPage() {
        listContainer.innerHTML = "";
        const start = (currentPage - 1) * perPage;
        const pageProjects = filtered.slice(start, start + perPage);
        if (pageProjects.length === 0) {
          const msg = document.createElement("p");
          msg.textContent = selectedCategories.size === 0 && selectedTech.size === 0 ? "Please make a selection" : "No projects match your filters";
          msg.className = "text-center text-gray-600 dark:text-gray-400";
          listContainer.appendChild(msg);
        } else {
          pageProjects.forEach((project) => {
            const card = buildProjectCard(project);
            listContainer.appendChild(card);
          });
          renderPagination();
        }
      }

      function renderPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filtered.length / perPage);
        if (totalPages <= 1) return;

        const prev = UIComponents.createButton({ text: "Prev", classes: "btn-secondary" });
        prev.disabled = currentPage === 1;
        if (prev.disabled) prev.classList.add("opacity-50", "cursor-not-allowed");
        prev.addEventListener("click", () => {
          if (currentPage > 1) {
            currentPage--;
            renderPage();
          }
        });

        const next = UIComponents.createButton({ text: "Next", classes: "btn-secondary" });
        next.disabled = currentPage === totalPages;
        if (next.disabled) next.classList.add("opacity-50", "cursor-not-allowed");
        next.addEventListener("click", () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderPage();
          }
        });

        const info = document.createElement("span");
        info.textContent = `Page ${currentPage} of ${totalPages}`;
        info.className = "px-4";

        paginationContainer.append(prev, info, next);
      }

      applyFilters();
    });

  function renderFilters(container, items, set, onChange) {
    items.forEach((item) => {
      const badge = UIComponents.createBadge({
        text: item,
        classes: "cursor-pointer opacity-60 transition border border-transparent",
      });
      badge.setAttribute("aria-pressed", "false");
      badge.addEventListener("click", () => {
        if (set.has(item)) {
          set.delete(item);
          badge.classList.add("opacity-60");
          badge.classList.remove("border-primary");
          badge.setAttribute("aria-pressed", "false");
        } else {
          set.add(item);
          badge.classList.remove("opacity-60");
          badge.classList.add("border-primary");
          badge.setAttribute("aria-pressed", "true");
        }
        onChange();
      });
      container.appendChild(badge);
    });
  }

  function buildProjectCard(project) {
    const card = document.createElement("div");
    card.className = "project-card card card-hoverable card-shadow p-0 flex flex-col h-full dark:bg-dark-background-secondary transition-opacity duration-300";
    card.dataset.tags = project.tags.join(",");

    card.innerHTML = `
      <div class="relative h-48">
        <img src="${project.image}" loading="lazy" alt="${project.title}" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-black/20"></div>
      </div>
      <div class="flex flex-1 flex-col p-6">
        <h3 class="mb-4 text-xl font-bold">${project.title}</h3>
        <p class="mb-4 text-gray-600 dark:text-gray-400">${project.description}</p>
        <div class="badge-container mb-6 mt-auto flex flex-wrap gap-2"></div>
        <div class="btn-container flex gap-4">
          <a href="${project.code}" class="flex items-center text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary">
            <i class="fa-brands fa-github mr-2"></i>Code
          </a>
        </div>
      </div>`;

    const badgeContainer = card.querySelector(".badge-container");
    project.tags.forEach((tag) => {
      const badge = UIComponents.createBadge({ text: tag });
      badgeContainer.appendChild(badge);
    });

    const btnContainer = card.querySelector(".btn-container");
    const viewBtn = UIComponents.createButton({ text: "View Project", href: project.live, classes: "btn-sm-primary" });
    btnContainer.prepend(viewBtn);

    return card;
  }
});
