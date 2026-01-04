/**
 * Filter State Unit Tests
 *
 * Tests for the createFilterState function that manages
 * project filtering by technology, category, and search query.
 */

import { createFilterState } from "./filter-state.js";

describe("createFilterState", () => {
  describe("initialization", () => {
    test("creates state with empty defaults", () => {
      const state = createFilterState();
      expect(state.serialise()).toEqual({
        tech: [],
        categories: [],
        searchQuery: "",
        sortBy: "default",
      });
    });

    test("creates state with initial values", () => {
      const state = createFilterState({
        tech: ["react", "vue"],
        categories: ["frontend"],
        searchQuery: "test",
        sortBy: "title-asc",
      });
      const serialized = state.serialise();
      expect(serialized.tech).toContain("react");
      expect(serialized.tech).toContain("vue");
      expect(serialized.categories).toContain("frontend");
      expect(serialized.searchQuery).toBe("test");
      expect(serialized.sortBy).toBe("title-asc");
    });

    test("handles partial initial values", () => {
      const state = createFilterState({ tech: ["javascript"] });
      const serialized = state.serialise();
      expect(serialized.tech).toContain("javascript");
      expect(serialized.categories).toEqual([]);
      expect(serialized.searchQuery).toBe("");
      expect(serialized.sortBy).toBe("default");
    });
  });

  describe("toggle", () => {
    test("adds value when not present", () => {
      const state = createFilterState();
      state.toggle("tech", "react");
      expect(state.isActive("tech", "react")).toBe(true);
    });

    test("removes value when already present", () => {
      const state = createFilterState({ tech: ["react"] });
      state.toggle("tech", "react");
      expect(state.isActive("tech", "react")).toBe(false);
    });

    test("handles toggle on categories", () => {
      const state = createFilterState();
      state.toggle("categories", "frontend");
      expect(state.isActive("categories", "frontend")).toBe(true);
      state.toggle("categories", "frontend");
      expect(state.isActive("categories", "frontend")).toBe(false);
    });
  });

  describe("isActive", () => {
    test("returns true for active filter", () => {
      const state = createFilterState({ tech: ["react"] });
      expect(state.isActive("tech", "react")).toBe(true);
    });

    test("returns false for inactive filter", () => {
      const state = createFilterState();
      expect(state.isActive("tech", "react")).toBe(false);
    });
  });

  describe("search", () => {
    test("sets and gets search query", () => {
      const state = createFilterState();
      state.setSearchQuery("react");
      expect(state.getSearchQuery()).toBe("react");
    });
  });

  describe("sort", () => {
    test("sets and gets sort by", () => {
      const state = createFilterState();
      state.setSortBy("title-asc");
      expect(state.getSortBy()).toBe("title-asc");
    });
  });

  describe("serialise", () => {
    test("returns all state fields", () => {
      const state = createFilterState({ tech: ["react"], searchQuery: "test" });
      const result = state.serialise();
      expect(result.tech).toEqual(["react"]);
      expect(result.searchQuery).toBe("test");
      expect(result.categories).toEqual([]);
      expect(result.sortBy).toBe("default");
    });
  });

  describe("hasSelections", () => {
    test("returns false when no selections", () => {
      const state = createFilterState();
      expect(state.hasSelections()).toBe(false);
    });

    test("returns true when tech selected", () => {
      const state = createFilterState({ tech: ["react"] });
      expect(state.hasSelections()).toBe(true);
    });

    test("returns true when search query set", () => {
      const state = createFilterState({ searchQuery: "test" });
      expect(state.hasSelections()).toBe(true);
    });
  });

  describe("apply", () => {
    const mockProjects = [
      { id: 1, title: "React App", description: "A react app", category: "frontend", tags: ["react", "javascript"] },
      { id: 2, title: "Vue Site", description: "A vue site", category: "frontend", tags: ["vue", "javascript"] },
      { id: 3, title: "Python API", description: "A python api", category: "backend", tags: ["python", "django"] },
      { id: 4, title: "FullStack", description: "A fullstack app", category: "fullstack", tags: ["react", "node"] },
    ];

    test("returns all projects when no selections", () => {
      const state = createFilterState();
      expect(state.apply(mockProjects)).toEqual(mockProjects);
    });

    test("filters by single tech", () => {
      const state = createFilterState({ tech: ["react"] });
      const result = state.apply(mockProjects);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toContain(1);
      expect(result.map((p) => p.id)).toContain(4);
    });

    test("filters by single category", () => {
      const state = createFilterState({ categories: ["frontend"] });
      const result = state.apply(mockProjects);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.category === "frontend")).toBe(true);
    });

    test("filters by search query", () => {
      const state = createFilterState({ searchQuery: "python" });
      const result = state.apply(mockProjects);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    test("filters by search query in tags", () => {
      const state = createFilterState({ searchQuery: "django" });
      const result = state.apply(mockProjects);
      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain("django");
    });

    test("applies sort", () => {
      const state = createFilterState({ sortBy: "title-asc" });
      const result = state.apply(mockProjects);
      expect(result[0].title).toBe("FullStack"); // F before P, R, V
      expect(result[3].title).toBe("Vue Site");
    });
  });
});
