export function createFilterState(initial = { tech: [], categories: [], searchQuery: "", sortBy: "default" }) {
  const state = {
    tech: new Set(initial.tech),
    categories: new Set(initial.categories),
    searchQuery: initial.searchQuery || "",
    sortBy: initial.sortBy || "default",
  };

  /**
   * Checks if a project matches the current search query
   */
  function matchesSearch(project, query) {
    if (!query.trim()) return true;
    const searchLower = query.toLowerCase();
    const titleMatch = project.title.toLowerCase().includes(searchLower);
    const descMatch = project.description.toLowerCase().includes(searchLower);
    const tagMatch = project.tags.some((tag) => tag.toLowerCase().includes(searchLower));
    const categoryMatch = project.category.toLowerCase().includes(searchLower);
    return titleMatch || descMatch || tagMatch || categoryMatch;
  }

  /**
   * Sorts projects based on the current sort setting
   */
  function sortProjects(projects) {
    const sorted = [...projects];
    switch (state.sortBy) {
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "category":
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sorted;
    }
  }

  return {
    toggle(group, value) {
      const set = state[group];
      if (!set) return;
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
    },

    remove(group, value) {
      const set = state[group];
      if (set) {
        set.delete(value);
      }
    },

    setSearchQuery(query) {
      state.searchQuery = query;
    },

    getSearchQuery() {
      return state.searchQuery;
    },

    setSortBy(sortOption) {
      state.sortBy = sortOption;
    },

    getSortBy() {
      return state.sortBy;
    },

    isActive(group, value) {
      const set = state[group];
      return set ? set.has(value) : false;
    },

    clearAll() {
      state.tech.clear();
      state.categories.clear();
      state.searchQuery = "";
      // Keep sortBy as is
    },

    serialise() {
      return {
        tech: Array.from(state.tech),
        categories: Array.from(state.categories),
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
      };
    },

    /**
     * Get all active filters as an array of { group, value } objects
     */
    getActiveFilters() {
      const filters = [];
      state.tech.forEach((value) => filters.push({ group: "tech", value }));
      state.categories.forEach((value) => filters.push({ group: "categories", value }));
      return filters;
    },

    /**
     * Get the count of active chip filters (tech + categories)
     */
    getFilterCount() {
      return state.tech.size + state.categories.size;
    },

    apply(projects) {
      // First, filter by search query
      let filtered = projects.filter((project) => matchesSearch(project, state.searchQuery));

      // Then filter by tech and categories (if any selected)
      if (state.tech.size || state.categories.size) {
        filtered = filtered.filter((project) => {
          const categoryMatch = !state.categories.size || state.categories.has(project.category);
          const techMatch = !state.tech.size || Array.from(state.tech).some((tech) => project.tags.includes(tech));
          return categoryMatch && techMatch;
        });
      }

      // Sort the results
      return sortProjects(filtered);
    },

    hasSelections() {
      return state.tech.size > 0 || state.categories.size > 0 || state.searchQuery.trim().length > 0;
    },

    hasChipFilters() {
      return state.tech.size > 0 || state.categories.size > 0;
    },
  };
}
