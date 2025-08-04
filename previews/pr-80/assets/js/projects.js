document.addEventListener('DOMContentLoaded', () => {
  const rowsContainer = document.getElementById('project-rows');
  const techFilterContainer = document.getElementById('filter-tech');
  const categoryFilterContainer = document.getElementById('filter-category');

  const selectedTech = new Set();
  const selectedCategories = new Set();

  fetch('../data/projects.json')
    .then((res) => res.json())
    .then((projects) => {
      const categories = [...new Set(projects.map((p) => p.category))];
      const techs = [...new Set(projects.flatMap((p) => p.tags))];

      renderFilters(categoryFilterContainer, categories, selectedCategories, applyFilters);
      renderFilters(techFilterContainer, techs, selectedTech, applyFilters);

      renderProjectRows(projects, categories, rowsContainer);

      function applyFilters() {
        document.querySelectorAll('.category-row').forEach((row) => {
          const category = row.dataset.category;
          const container = row.querySelector('.row-scroll');
          const showRow = selectedCategories.size === 0 || selectedCategories.has(category);

          let visible = 0;
          container.querySelectorAll('.project-card').forEach((card) => {
            const tags = card.dataset.tags.split(',');
            const matchesTech = selectedTech.size === 0 || [...selectedTech].every((t) => tags.includes(t));

            if (showRow && matchesTech) {
              card.classList.remove('hidden');
              requestAnimationFrame(() => card.classList.remove('opacity-0'));
              visible++;
            } else {
              card.classList.add('opacity-0');
              setTimeout(() => card.classList.add('hidden'), 300);
            }
          });

          if (showRow && visible > 0) {
            row.classList.remove('hidden');
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            row.classList.add('hidden');
          }
        });
      }
    });

  function renderFilters(container, items, set, onChange) {
    items.forEach((item) => {
      const badge = UIComponents.createBadge({ text: item, classes: 'cursor-pointer opacity-60 transition' });
      badge.addEventListener('click', () => {
        if (set.has(item)) {
          set.delete(item);
          badge.classList.add('opacity-60');
        } else {
          set.add(item);
          badge.classList.remove('opacity-60');
        }
        onChange();
      });
      container.appendChild(badge);
    });
  }

  function renderProjectRows(projects, categories, container) {
    categories.forEach((cat) => {
      const section = document.createElement('div');
      section.className = 'category-row space-y-4';
      section.dataset.category = cat;

      const heading = document.createElement('h3');
      heading.className = 'text-xl font-bold';
      heading.textContent = cat;
      section.appendChild(heading);

      const row = document.createElement('div');
      row.className = 'row-scroll flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory';
      section.appendChild(row);

      projects
        .filter((p) => p.category === cat)
        .forEach((project) => {
          const card = buildProjectCard(project);
          row.appendChild(card);
        });

      container.appendChild(section);
    });
  }

  function buildProjectCard(project) {
    const card = document.createElement('div');
    card.className =
      'project-card card card-hoverable card-shadow p-0 dark:bg-dark-background-secondary transition-opacity duration-300 flex-shrink-0 w-72 snap-start';
    card.dataset.tags = project.tags.join(',');

    card.innerHTML = `
      <div class="relative h-48">
        <img src="${project.image}" loading="lazy" alt="${project.title}" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-black/20"></div>
      </div>
      <div class="p-6">
        <h3 class="mb-4 text-xl font-bold">${project.title}</h3>
        <p class="text-gray-600 dark:text-gray-400">${project.description}</p>
        <div class="badge-container my-6 flex flex-wrap gap-2"></div>
        <div class="btn-container flex gap-4">
          <a href="${project.code}" class="flex items-center text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary">
            <i class="fa-brands fa-github mr-2"></i>Code
          </a>
        </div>
      </div>`;

    const badgeContainer = card.querySelector('.badge-container');
    project.tags.forEach((tag) => {
      const badge = UIComponents.createBadge({ text: tag });
      badgeContainer.appendChild(badge);
    });

    const btnContainer = card.querySelector('.btn-container');
    const viewBtn = UIComponents.createButton({ text: 'View Project', href: project.live, classes: 'btn-sm-primary' });
    btnContainer.prepend(viewBtn);

    return card;
  }
});
