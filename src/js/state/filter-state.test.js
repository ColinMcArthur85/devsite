/**
 * Filter State Unit Tests
 *
 * Tests for the createFilterState function that manages
 * project filtering by technology and category.
 */

import { createFilterState } from "./filter-state.js";

describe("createFilterState", () => {
  describe("initialization", () => {
    test("creates state with empty defaults", () => {
      const state = createFilterState();
      expect(state.serialise()).toEqual({ tech: [], categories: [] });
    });

    test("creates state with initial values", () => {
      const state = createFilterState({
        tech: ["react", "vue"],
        categories: ["frontend"],
      });
      const serialized = state.serialise();
      expect(serialized.tech).toContain("react");
      expect(serialized.tech).toContain("vue");
      expect(serialized.categories).toContain("frontend");
    });

    test("handles partial initial values", () => {
      const state = createFilterState({ tech: ["javascript"] });
      const serialized = state.serialise();
      expect(serialized.tech).toContain("javascript");
      expect(serialized.categories).toEqual([]);
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

    test("does nothing for invalid group", () => {
      const state = createFilterState();
      state.toggle("invalid", "value");
      expect(state.serialise()).toEqual({ tech: [], categories: [] });
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

    test("returns false for invalid group", () => {
      const state = createFilterState();
      expect(state.isActive("invalid", "value")).toBe(false);
    });
  });

  describe("serialise", () => {
    test("returns arrays from sets", () => {
      const state = createFilterState({ tech: ["a", "b"], categories: ["c"] });
      const result = state.serialise();
      expect(Array.isArray(result.tech)).toBe(true);
      expect(Array.isArray(result.categories)).toBe(true);
    });

    test("returns empty arrays when no selections", () => {
      const state = createFilterState();
      expect(state.serialise()).toEqual({ tech: [], categories: [] });
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

    test("returns true when category selected", () => {
      const state = createFilterState({ categories: ["frontend"] });
      expect(state.hasSelections()).toBe(true);
    });
  });

  describe("resetIfEmpty", () => {
    test("returns true when no selections", () => {
      const state = createFilterState();
      expect(state.resetIfEmpty()).toBe(true);
    });

    test("returns false when has selections", () => {
      const state = createFilterState({ tech: ["react"] });
      expect(state.resetIfEmpty()).toBe(false);
    });
  });

  describe("apply", () => {
    const mockProjects = [
      { id: 1, category: "frontend", tags: ["react", "javascript"] },
      { id: 2, category: "frontend", tags: ["vue", "javascript"] },
      { id: 3, category: "backend", tags: ["python", "django"] },
      { id: 4, category: "fullstack", tags: ["react", "node"] },
    ];

    test("returns empty array when no selections", () => {
      const state = createFilterState();
      expect(state.apply(mockProjects)).toEqual([]);
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

    test("filters by tech OR (any match)", () => {
      const state = createFilterState({ tech: ["react", "vue"] });
      const result = state.apply(mockProjects);
      expect(result).toHaveLength(3);
    });

    test("filters by tech AND category", () => {
      const state = createFilterState({
        tech: ["react"],
        categories: ["frontend"],
      });
      const result = state.apply(mockProjects);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test("returns empty when no matches", () => {
      const state = createFilterState({ tech: ["nonexistent"] });
      const result = state.apply(mockProjects);
      expect(result).toEqual([]);
    });

    test("handles empty projects array", () => {
      const state = createFilterState({ tech: ["react"] });
      expect(state.apply([])).toEqual([]);
    });
  });
});
