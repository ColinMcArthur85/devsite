import { ProjectService } from "./services/project-service.js";
import { createFilterState } from "./state/filter-state.js";
import { FilterView } from "./views/filter-view.js";
import { ResultsView } from "./views/results-view.js";
import { createBadge } from "./components/ui.js";

const SELECTORS = {
  list: "project-list",
  pagination: "pagination",
  techFilters: "filter-tech",
  categoryFilters: "filter-category",
  resultsCount: "results-count",
  searchInput: "project-search",
  sortSelect: "sort-select",
  toggleFilters: "toggle-filters",
  filterPanel: "filter-panel",
  activeFilters: "active-filters",
  clearFilters: "clear-filters",
  filterCountBadge: "filter-count-badge",
};

const STORAGE_KEY = "projectFilters";

const FilterStorage = {
  load() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return stored || { tech: [], categories: [], searchQuery: "", sortBy: "default" };
    } catch (error) {
      console.warn("Unable to read project filters from storage", error);
      return { tech: [], categories: [], searchQuery: "", sortBy: "default" };
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

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function initProjects() {
  const listContainer = document.getElementById(SELECTORS.list);
  const paginationContainer = document.getElementById(SELECTORS.pagination);
  const techFilterContainer = document.getElementById(SELECTORS.techFilters);
  const categoryFilterContainer = document.getElementById(SELECTORS.categoryFilters);
  const resultsCount = document.getElementById(SELECTORS.resultsCount);
  const searchInput = document.getElementById(SELECTORS.searchInput);
  const sortSelect = document.getElementById(SELECTORS.sortSelect);
  const toggleFiltersBtn = document.getElementById(SELECTORS.toggleFilters);
  const filterPanel = document.getElementById(SELECTORS.filterPanel);
  const activeFiltersContainer = document.getElementById(SELECTORS.activeFilters);
  const clearFiltersBtn = document.getElementById(SELECTORS.clearFilters);
  const filterCountBadge = document.getElementById(SELECTORS.filterCountBadge);

  if (!listContainer || !paginationContainer || !techFilterContainer || !categoryFilterContainer) {
    return;
  }

  const stored = FilterStorage.load();
  const filterState = createFilterState(stored);
  const resultsView = ResultsView(listContainer, paginationContainer, resultsCount);

  let allProjects = [];

  /**
   * Update the filter count badge visibility and value
   */
  function updateFilterCountBadge() {
    const count = filterState.getFilterCount();
    if (filterCountBadge) {
      if (count > 0) {
        filterCountBadge.textContent = count;
        filterCountBadge.classList.remove("hidden");
      } else {
        filterCountBadge.classList.add("hidden");
      }
    }
  }

  /**
   * Render active filter chips
   */
  function renderActiveFilters() {
    if (!activeFiltersContainer) return;
    activeFiltersContainer.innerHTML = "";

    const activeFilters = filterState.getActiveFilters();
    if (activeFilters.length === 0) {
      return;
    }

    // Add a label
    const label = document.createElement("span");
    label.className = "text-sm font-medium text-slate-600 dark:text-slate-400";
    label.textContent = "Active:";
    activeFiltersContainer.appendChild(label);

    // Add chips for each active filter
    activeFilters.forEach(({ group, value }) => {
      const chip = document.createElement("button");
      chip.className =
        "active-filter-chip inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/20 dark:border-primary/40 dark:bg-primary/20 dark:text-primary-light";
      chip.innerHTML = `
        <span>${value}</span>
        <svg class="icon text-xs" aria-hidden="true" focusable="false">
          <use href="../assets/icons/sprite.svg#xmark"></use>
        </svg>
      `;
      chip.setAttribute("aria-label", `Remove ${value} filter`);
      chip.addEventListener("click", () => {
        filterState.remove(group, value);
        // Update the corresponding pill in the filter panel
        const pill = document.querySelector(`[data-filter-group="${group}"][data-filter-value="${value}"]`);
        if (pill) {
          pill.classList.remove("is-active");
          pill.setAttribute("aria-pressed", "false");
        }
        onFiltersChanged();
      });
      activeFiltersContainer.appendChild(chip);
    });
  }

  /**
   * Main callback when any filter changes
   */
  function onFiltersChanged() {
    FilterStorage.save(filterState.serialise());
    updateFilterCountBadge();
    renderActiveFilters();

    const filtered = filterState.apply(allProjects);
    
    if (!filterState.hasSelections() && allProjects.length) {
      // Show all projects if no filters are active
      resultsView.update(filterState.apply(allProjects.slice())); // Apply sort at minimum
      resultsView.updateTotalCount(allProjects.length);
      return;
    }

    if (!filtered.length && filterState.hasSelections()) {
      resultsView.showEmptyState(true);
      return;
    }

    resultsView.update(filtered);
    resultsView.updateTotalCount(allProjects.length);
  }

  /**
   * Toggle filter panel visibility
   */
  function toggleFilterPanel() {
    const isExpanded = filterPanel.classList.toggle("hidden");
    toggleFiltersBtn.setAttribute("aria-expanded", !isExpanded);
    const chevron = toggleFiltersBtn.querySelector(".chevron-icon");
    if (chevron) {
      chevron.style.transform = isExpanded ? "" : "rotate(180deg)";
    }
  }

  /**
   * Clear all filters
   */
  function clearAllFilters() {
    filterState.clearAll();
    
    // Reset search input
    if (searchInput) {
      searchInput.value = "";
    }
    
    // Reset all pill states
    document.querySelectorAll("[data-filter-value]").forEach((pill) => {
      pill.classList.remove("is-active");
      pill.setAttribute("aria-pressed", "false");
    });
    
    onFiltersChanged();
  }

  // Set up event listeners
  if (toggleFiltersBtn && filterPanel) {
    toggleFiltersBtn.addEventListener("click", toggleFilterPanel);
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAllFilters);
  }

  // Search input with debounce
  if (searchInput) {
    searchInput.value = filterState.getSearchQuery();
    const handleSearch = debounce((e) => {
      filterState.setSearchQuery(e.target.value);
      onFiltersChanged();
    }, 250);
    searchInput.addEventListener("input", handleSearch);
  }

  // Sort select
  if (sortSelect) {
    sortSelect.value = filterState.getSortBy();
    sortSelect.addEventListener("change", (e) => {
      filterState.setSortBy(e.target.value);
      onFiltersChanged();
    });
  }

  // Filter views for tech and category chips
  const techView = FilterView(techFilterContainer, "tech", (value) => {
    filterState.toggle("tech", value);
    onFiltersChanged();
  });
  
  const categoryView = FilterView(categoryFilterContainer, "categories", (value) => {
    filterState.toggle("categories", value);
    onFiltersChanged();
  });

  // Fetch and render projects
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProjects);
} else {
  initProjects();
}
