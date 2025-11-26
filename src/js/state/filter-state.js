export function createFilterState(initial = { tech: [], categories: [] }) {
  const state = {
    tech: new Set(initial.tech),
    categories: new Set(initial.categories),
  };

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
    isActive(group, value) {
      const set = state[group];
      return set ? set.has(value) : false;
    },
    resetIfEmpty() {
      if (!state.tech.size && !state.categories.size) {
        return true;
      }
      return false;
    },
    serialise() {
      return {
        tech: Array.from(state.tech),
        categories: Array.from(state.categories),
      };
    },
    apply(projects) {
      if (!state.tech.size && !state.categories.size) {
        return [];
      }
      return projects.filter((project) => {
        const categoryMatch = !state.categories.size || state.categories.has(project.category);
        const techMatch = !state.tech.size || Array.from(state.tech).some((tech) => project.tags.includes(tech));
        return categoryMatch && techMatch;
      });
    },
    hasSelections() {
      return state.tech.size > 0 || state.categories.size > 0;
    },
  };
}
