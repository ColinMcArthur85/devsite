import { ProjectService } from './services/project-service.js';
import { createFilterState } from './state/filter-state.js';
import { FilterView } from './views/filter-view.js';
import { ResultsView } from './views/results-view.js';

const SELECTORS = {
  list: "project-list",
  pagination: "pagination",
  techFilters: "filter-tech",
  categoryFilters: "filter-category",
  resultsCount: "results-count",
};

const STORAGE_KEY = "projectFilters";

const FilterStorage = {
  load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { tech: [], categories: [] };
    } catch (error) {
      console.warn("Unable to read project filters from storage", error);
      return { tech: [], categories: [] };
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Unable to persist project filters", error);
    }
  },
};

function initProjects() {
  const listContainer = document.getElementById(SELECTORS.list);
  const paginationContainer = document.getElementById(SELECTORS.pagination);
  const techFilterContainer = document.getElementById(SELECTORS.techFilters);
  const categoryFilterContainer = document.getElementById(SELECTORS.categoryFilters);
  const resultsCount = document.getElementById(SELECTORS.resultsCount);

  if (!listContainer || !paginationContainer || !techFilterContainer || !categoryFilterContainer) {
    return;
  }

  const stored = FilterStorage.load();
  const filterState = createFilterState(stored);
  const resultsView = ResultsView(listContainer, paginationContainer, resultsCount);

  function onFiltersChanged() {
    FilterStorage.save(filterState.serialise());
    const filtered = filterState.apply(allProjects);
    if (!filterState.hasSelections()) {
      resultsView.showEmptyState(false);
      return;
    }
    if (!filtered.length) {
      resultsView.showEmptyState(true);
      return;
    }
    resultsView.update(filtered);
  }

  const techView = FilterView(techFilterContainer, "tech", (value) => {
    filterState.toggle("tech", value);
    onFiltersChanged();
  });
  const categoryView = FilterView(categoryFilterContainer, "categories", (value) => {
    filterState.toggle("categories", value);
    onFiltersChanged();
  });

  let allProjects = [];
  ProjectService.fetchAll()
    .then((projects) => {
      allProjects = projects;
      const categories = Array.from(new Set(projects.map((project) => project.category)));
      const techs = Array.from(new Set(projects.flatMap((project) => project.tags)));

      techView.render(techs, filterState);
      categoryView.render(categories, filterState);

      onFiltersChanged();
    })
    .catch((error) => {
      console.error(error);
      resultsView.showEmptyState(true);
    });
}

// Initialize on load
// Since this is a module, we can just run initProjects() if the DOM is ready, or wait for it.
// Or we can export it.
// The original code used a global array to init.
// For now, let's just run it if we are on the projects page.
// Or export it and let a main.js handle it.
// But index.html imports this file directly.
// So let's run it.

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjects);
} else {
  initProjects();
}
