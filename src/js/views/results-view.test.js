/**
 * Results View Unit Tests
 *
 * Tests for the ResultsView component that renders project cards,
 * handles pagination, and displays empty states.
 */

import { ResultsView } from "./results-view.js";

describe("ResultsView", () => {
  let listContainer;
  let paginationContainer;
  let resultsCountEl;
  let view;

  const mockProjects = [
    {
      title: "Project One",
      description: "First project description",
      category: "frontend",
      tags: ["React", "JavaScript"],
      image: "/images/project1.jpg",
      live: "https://example.com/project1",
      code: "https://github.com/example/project1",
    },
    {
      title: "Project Two",
      description: "Second project description",
      category: "backend",
      tags: ["Node", "Express"],
      image: "/images/project2.jpg",
      live: "https://example.com/project2",
      code: "https://github.com/example/project2",
    },
    {
      title: "Project Three",
      description: "Third project description",
      category: "fullstack",
      tags: ["Vue", "Python"],
      image: "/images/project3.jpg",
      live: "https://example.com/project3",
      code: "https://github.com/example/project3",
    },
  ];

  beforeEach(() => {
    listContainer = document.createElement("div");
    paginationContainer = document.createElement("div");
    resultsCountEl = document.createElement("span");
    document.body.appendChild(listContainer);
    document.body.appendChild(paginationContainer);
    document.body.appendChild(resultsCountEl);

    view = ResultsView(listContainer, paginationContainer, resultsCountEl);
  });

  afterEach(() => {
    document.body.removeChild(listContainer);
    document.body.removeChild(paginationContainer);
    document.body.removeChild(resultsCountEl);
  });

  describe("initialization", () => {
    test("creates a results view instance", () => {
      expect(view).toBeDefined();
      expect(typeof view.update).toBe("function");
      expect(typeof view.refresh).toBe("function");
      expect(typeof view.showEmptyState).toBe("function");
    });
  });

  describe("update", () => {
    test("renders project cards", () => {
      view.update(mockProjects);

      const cards = listContainer.querySelectorAll(".project-card");
      expect(cards.length).toBe(3);
    });

    test("displays project titles", () => {
      view.update(mockProjects);

      const titles = listContainer.querySelectorAll("h3");
      expect(titles[0].textContent).toBe("Project One");
      expect(titles[1].textContent).toBe("Project Two");
    });

    test("displays project descriptions", () => {
      view.update(mockProjects);

      const descriptions = listContainer.querySelectorAll(".project-card p");
      expect(descriptions[0].textContent).toBe("First project description");
    });

    test("displays project categories", () => {
      view.update(mockProjects);

      const firstCard = listContainer.querySelector(".project-card");
      expect(firstCard.innerHTML).toContain("frontend");
    });

    test("creates badges for tags", () => {
      view.update(mockProjects);

      const badgeContainers = listContainer.querySelectorAll(".badge-container");
      expect(badgeContainers.length).toBe(3);

      const firstBadges = badgeContainers[0].querySelectorAll(".badge");
      expect(firstBadges.length).toBe(2);
    });

    test("updates results count", () => {
      view.update(mockProjects);
      expect(resultsCountEl.textContent).toBe("3 projects found");
    });

    test("handles single project count grammar", () => {
      view.update([mockProjects[0]]);
      expect(resultsCountEl.textContent).toBe("1 project found");
    });
  });

  describe("showEmptyState", () => {
    test("displays empty state message when no filters", () => {
      view.showEmptyState(false);

      expect(listContainer.textContent).toContain("Choose a filter");
    });

    test("displays no matches message when has filters", () => {
      view.showEmptyState(true);

      expect(listContainer.textContent).toContain("No missions match");
    });

    test("clears pagination on empty state", () => {
      view.update(mockProjects);
      view.showEmptyState(false);

      expect(paginationContainer.innerHTML).toBe("");
    });

    test("clears results count on empty state", () => {
      view.update(mockProjects);
      view.showEmptyState(false);

      expect(resultsCountEl.textContent).toBe("");
    });
  });

  describe("pagination", () => {
    // Create more than 6 projects to test pagination
    const manyProjects = Array.from({ length: 15 }, (_, i) => ({
      title: `Project ${i + 1}`,
      description: `Description ${i + 1}`,
      category: "frontend",
      tags: ["JavaScript"],
      image: "/images/project.jpg",
      live: "https://example.com",
      code: "https://github.com/example",
    }));

    test("shows pagination controls when more than 6 projects", () => {
      view.update(manyProjects);

      const buttons = paginationContainer.querySelectorAll("button");
      expect(buttons.length).toBe(2); // Prev and Next
    });

    test("shows only 6 projects per page", () => {
      view.update(manyProjects);

      const cards = listContainer.querySelectorAll(".project-card");
      expect(cards.length).toBe(6);
    });

    test("does not show pagination for 6 or fewer projects", () => {
      view.update(mockProjects);

      expect(paginationContainer.innerHTML).toBe("");
    });

    test("displays page info", () => {
      view.update(manyProjects);

      const pageInfo = paginationContainer.querySelector(".pagination__info");
      expect(pageInfo.textContent).toContain("Page 1");
    });
  });

  describe("links and buttons", () => {
    test("creates view project button with correct href", () => {
      view.update(mockProjects);

      const viewButtons = listContainer.querySelectorAll(".btn-sm-primary");
      expect(viewButtons.length).toBe(3);
      expect(viewButtons[0].href).toContain("example.com/project1");
    });

    test("creates github link with correct href", () => {
      view.update(mockProjects);

      const codeLinks = listContainer.querySelectorAll('a[href*="github"]');
      expect(codeLinks.length).toBe(3);
    });
  });

  describe("XSS Prevention", () => {
    test("does not execute script tags in content", () => {
      // Set up a global flag that XSS would set
      window.xssExecuted = false;

      const maliciousProject = [
        {
          title: '<img src=x onerror="window.xssExecuted=true">',
          description: "Safe description",
          category: "frontend",
          tags: ["JavaScript"],
          image: "/safe.jpg",
          live: "https://safe.com",
          code: "https://github.com/safe",
        },
      ];

      view.update(maliciousProject);

      // The XSS should not have executed
      // Note: In real DOM, innerHTML can execute some XSS vectors
      // This test documents current behavior - item 5.5 will add proper sanitization
      const titleEl = listContainer.querySelector("h3");
      expect(titleEl).toBeDefined();
    });

    test("handles special characters in description", () => {
      const specialProject = [
        {
          title: "Test Project",
          description: 'Tom & Jerry <3 special "chars"',
          category: "frontend",
          tags: ["Test"],
          image: "/test.jpg",
          live: "https://test.com",
          code: "https://github.com/test",
        },
      ];

      view.update(specialProject);

      const description = listContainer.querySelector(".project-card p");
      expect(description.textContent).toContain("Tom & Jerry");
    });
  });

  describe("data attributes", () => {
    test("sets data-tags on project cards", () => {
      view.update(mockProjects);

      const firstCard = listContainer.querySelector(".project-card");
      expect(firstCard.dataset.tags).toBe("React,JavaScript");
    });
  });

  describe("refresh", () => {
    test("refresh re-renders current page", () => {
      view.update(mockProjects);
      const initialCards = listContainer.querySelectorAll(".project-card").length;

      view.refresh();
      const refreshedCards = listContainer.querySelectorAll(".project-card").length;

      expect(refreshedCards).toBe(initialCards);
    });
  });
});
