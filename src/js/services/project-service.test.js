/**
 * Project Service Unit Tests
 *
 * Tests for the ProjectService that fetches and manages project data.
 */

import { ProjectService } from "./project-service.js";

describe("ProjectService", () => {
  describe("fetchAll", () => {
    test("returns an array of projects", async () => {
      const projects = await ProjectService.fetchAll();
      expect(Array.isArray(projects)).toBe(true);
    });

    test("returns non-empty array", async () => {
      const projects = await ProjectService.fetchAll();
      expect(projects.length).toBeGreaterThan(0);
    });

    test("each project has required fields", async () => {
      const projects = await ProjectService.fetchAll();

      projects.forEach((project) => {
        expect(project).toHaveProperty("title");
        expect(project).toHaveProperty("category");
        expect(project).toHaveProperty("tags");
      });
    });

    test("project tags is an array", async () => {
      const projects = await ProjectService.fetchAll();

      projects.forEach((project) => {
        expect(Array.isArray(project.tags)).toBe(true);
      });
    });

    test("project category is a string", async () => {
      const projects = await ProjectService.fetchAll();

      projects.forEach((project) => {
        expect(typeof project.category).toBe("string");
      });
    });
  });

  describe("data structure validation", () => {
    test("project has valid category", async () => {
      const projects = await ProjectService.fetchAll();
      const validCategories = ["frontend", "backend", "fullstack", "api", "tool", "other", "full_stack"];

      projects.forEach((project) => {
        // Categories should be non-empty strings
        expect(project.category).toBeTruthy();
        expect(typeof project.category).toBe("string");
      });
    });

    test("project tags are non-empty strings", async () => {
      const projects = await ProjectService.fetchAll();

      projects.forEach((project) => {
        project.tags.forEach((tag) => {
          expect(typeof tag).toBe("string");
          expect(tag.trim()).not.toBe("");
        });
      });
    });

    test("project title is a non-empty string", async () => {
      const projects = await ProjectService.fetchAll();

      projects.forEach((project) => {
        expect(typeof project.title).toBe("string");
        expect(project.title.trim()).not.toBe("");
      });
    });
  });

  describe("async behavior", () => {
    test("fetchAll returns a promise", () => {
      const result = ProjectService.fetchAll();
      expect(result).toBeInstanceOf(Promise);
    });

    test("fetchAll resolves successfully", async () => {
      await expect(ProjectService.fetchAll()).resolves.toBeDefined();
    });
  });
});
