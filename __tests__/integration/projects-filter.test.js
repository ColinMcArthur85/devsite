/**
 * Projects Filter Integration Tests
 *
 * Tests the full filtering workflow by integrating:
 * - FilterState (state management)
 * - ProjectService (data)
 * - FilterView (UI)
 * - ResultsView (display)
 */

import { createFilterState } from "../../src/js/state/filter-state.js";
import { ProjectService } from "../../src/js/services/project-service.js";

describe("Projects Filter Integration", () => {
  describe("Full Filtering Workflow", () => {
    let filterState;
    let projects;

    beforeEach(async () => {
      filterState = createFilterState();
      projects = await ProjectService.fetchAll();
    });

    test("fetches projects successfully", async () => {
      expect(projects.length).toBeGreaterThan(0);
    });

    test("initial state has no filters applied", () => {
      expect(filterState.hasSelections()).toBe(false);
      expect(filterState.serialise()).toEqual({
        tech: [],
        categories: [],
        searchQuery: "",
        sortBy: "default",
      });
    });

    test("can add a technology filter", () => {
      filterState.toggle("tech", "JavaScript");
      expect(filterState.isActive("tech", "JavaScript")).toBe(true);
      expect(filterState.hasSelections()).toBe(true);
    });

    test("can add a category filter", () => {
      filterState.toggle("categories", "frontend");
      expect(filterState.isActive("categories", "frontend")).toBe(true);
    });

    test("can toggle filter off", () => {
      filterState.toggle("tech", "JavaScript");
      filterState.toggle("tech", "JavaScript");
      expect(filterState.isActive("tech", "JavaScript")).toBe(false);
    });

    test("apply filter reduces projects or keeps them all if no filters", () => {
      // By default with no filters, it should return all
      expect(filterState.apply(projects).length).toBe(projects.length);

      // First, find a technology that exists in projects
      const techTags = new Set();
      projects.forEach((p) => p.tags.forEach((tag) => techTags.add(tag)));
      const firstTag = Array.from(techTags)[0];

      filterState.toggle("tech", firstTag);
      const filtered = filterState.apply(projects);

      expect(filtered.length).toBeLessThanOrEqual(projects.length);
      expect(filtered.length).toBeGreaterThan(0);

      // All filtered projects should have the tag
      filtered.forEach((p) => {
        expect(p.tags).toContain(firstTag);
      });
    });

    test("multiple tech filters use OR logic", () => {
      const techTags = new Set();
      projects.forEach((p) => p.tags.forEach((tag) => techTags.add(tag)));
      const tags = Array.from(techTags).slice(0, 2);

      if (tags.length >= 2) {
        filterState.toggle("tech", tags[0]);
        const firstFiltered = filterState.apply(projects);

        filterState.toggle("tech", tags[1]);
        const bothFiltered = filterState.apply(projects);

        // Adding more OR options should give same or more results
        expect(bothFiltered.length).toBeGreaterThanOrEqual(firstFiltered.length);
      }
    });

    test("tech AND category use AND logic", () => {
      // Get first available category
      const categories = new Set(projects.map((p) => p.category));
      const firstCategory = Array.from(categories)[0];

      // Get first available tech
      const techTags = new Set();
      projects.forEach((p) => p.tags.forEach((tag) => techTags.add(tag)));
      const firstTag = Array.from(techTags)[0];

      // Filter by category only
      filterState.toggle("categories", firstCategory);
      const categoryOnly = filterState.apply(projects);

      // Add tech filter (AND logic should reduce results)
      filterState.toggle("tech", firstTag);
      const bothFilters = filterState.apply(projects);

      expect(bothFilters.length).toBeLessThanOrEqual(categoryOnly.length);
    });

    test("serialise captures current state including search and sort", () => {
      filterState.toggle("tech", "React");
      filterState.setSearchQuery("test query");
      filterState.setSortBy("title-asc");

      const serialized = filterState.serialise();

      expect(serialized.tech).toContain("React");
      expect(serialized.searchQuery).toBe("test query");
      expect(serialized.sortBy).toBe("title-asc");
    });
  });

  describe("Filter Persistence Simulation", () => {
    test("can restore state from serialized data", () => {
      // Simulate saving state
      const savedState = { tech: ["React"], categories: ["frontend"], searchQuery: "test", sortBy: "title-desc" };

      // Restore to new filterState
      const restoredState = createFilterState(savedState);

      expect(restoredState.isActive("tech", "React")).toBe(true);
      expect(restoredState.isActive("categories", "frontend")).toBe(true);
      expect(restoredState.getSearchQuery()).toBe("test");
      expect(restoredState.getSortBy()).toBe("title-desc");
    });
  });

  describe("Edge Cases", () => {
    test("empty filters return all projects by default", () => {
      const filterState = createFilterState();
      const projects = [{ category: "test", tags: ["a"] }];

      // New behavior: if no filters active, return ALL projects
      expect(filterState.apply(projects)).toEqual(projects);
    });

    test("non-matching filter returns empty array", () => {
      const filterState = createFilterState({ tech: ["nonexistent-tech-xyz"] });
      const projects = [{ category: "test", tags: ["javascript"] }];

      expect(filterState.apply(projects)).toEqual([]);
    });

    test("handles projects with empty tags array", () => {
      const filterState = createFilterState({ tech: ["React"] });
      const projects = [
        { id: 1, title: 'No Tags', category: "test", tags: [] },
        { id: 2, title: 'Has Tag', category: "test", tags: ["React"] },
      ];

      const filtered = filterState.apply(projects);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(2);
    });
  });
});
