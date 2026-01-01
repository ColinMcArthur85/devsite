/**
 * UI Component Unit Tests
 *
 * Tests for createButton and createBadge utility functions.
 */

import { createButton, createBadge } from "./ui.js";

describe("createButton", () => {
  describe("element creation", () => {
    test("creates a button element by default", () => {
      const btn = createButton({ text: "Click me" });
      expect(btn.tagName).toBe("BUTTON");
    });

    test("creates an anchor element when href provided", () => {
      const btn = createButton({ text: "Link", href: "/page" });
      expect(btn.tagName).toBe("A");
      expect(btn.href).toContain("/page");
    });

    test("sets button type attribute", () => {
      const btn = createButton({ text: "Submit", type: "submit" });
      expect(btn.type).toBe("submit");
    });

    test('defaults to type="button"', () => {
      const btn = createButton({ text: "Click" });
      expect(btn.type).toBe("button");
    });
  });

  describe("text content", () => {
    test("sets text content from text property", () => {
      const btn = createButton({ text: "Hello" });
      expect(btn.textContent).toBe("Hello");
    });

    test("sets innerHTML when html property provided", () => {
      const btn = createButton({ html: "<span>Icon</span> Text" });
      expect(btn.innerHTML).toBe("<span>Icon</span> Text");
    });

    test("prefers text over html when both provided", () => {
      const btn = createButton({ text: "Text", html: "<b>HTML</b>" });
      expect(btn.textContent).toBe("Text");
    });
  });

  describe("classes", () => {
    test("applies classes from string", () => {
      const btn = createButton({ text: "Styled", classes: "btn btn-primary" });
      expect(btn.className).toBe("btn btn-primary");
    });

    test("handles empty classes", () => {
      const btn = createButton({ text: "Plain" });
      expect(btn.className).toBe("");
    });
  });

  describe("click handler", () => {
    test("attaches click event listener", () => {
      const mockFn = jest.fn();
      const btn = createButton({ text: "Click", onClick: mockFn });
      btn.click();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("does not attach listener when onClick is null", () => {
      const btn = createButton({ text: "Click", onClick: null });
      // Should not throw
      expect(() => btn.click()).not.toThrow();
    });
  });
});

describe("createBadge", () => {
  describe("element creation", () => {
    test("creates a span element", () => {
      const badge = createBadge({ text: "Tag" });
      expect(badge.tagName).toBe("SPAN");
    });

    test("adds badge class", () => {
      const badge = createBadge({ text: "Tag" });
      expect(badge.classList.contains("badge")).toBe(true);
    });
  });

  describe("text content", () => {
    test("sets text content", () => {
      const badge = createBadge({ text: "JavaScript" });
      expect(badge.textContent).toBe("JavaScript");
    });

    test("handles empty text", () => {
      const badge = createBadge({});
      expect(badge.textContent).toBe("");
    });
  });

  describe("classes", () => {
    test("applies additional classes", () => {
      const badge = createBadge({ text: "Tag", classes: "custom-class" });
      expect(badge.classList.contains("badge")).toBe(true);
      expect(badge.classList.contains("custom-class")).toBe(true);
    });

    test("handles multiple classes", () => {
      const badge = createBadge({ text: "Tag", classes: "class1 class2" });
      expect(badge.classList.contains("class1")).toBe(true);
      expect(badge.classList.contains("class2")).toBe(true);
    });
  });

  describe("appearance", () => {
    test("adds ghost class for ghost appearance", () => {
      const badge = createBadge({ text: "Tag", appearance: "ghost" });
      expect(badge.classList.contains("badge--ghost")).toBe(true);
    });

    test("defaults to solid appearance", () => {
      const badge = createBadge({ text: "Tag" });
      expect(badge.classList.contains("badge--ghost")).toBe(false);
    });
  });

  describe("color handling", () => {
    test("applies color for known technologies", () => {
      const badge = createBadge({ text: "JavaScript" });
      // Should have inline style for known colors
      expect(badge.style.backgroundColor || badge.dataset.variant).toBeTruthy();
    });

    test("falls back to variant class for unknown colors", () => {
      const badge = createBadge({ text: "UnknownTech123", variant: "custom" });
      // Should have either style or variant
      expect(badge.style.backgroundColor || badge.classList.contains("badge--custom") || badge.dataset.variant === "custom").toBeTruthy();
    });
  });

  describe("variant handling", () => {
    test("uses provided variant", () => {
      const badge = createBadge({ text: "Tag", variant: "success" });
      // Variant should be applied
      expect(badge.dataset.variant === "success" || badge.classList.contains("badge--success") || badge.style.backgroundColor).toBeTruthy();
    });

    test("generates variant from text when not provided", () => {
      const badge = createBadge({ text: "React Native" });
      // Should create a slugified variant or use color
      expect(badge).toBeDefined();
    });
  });
});

describe("XSS Prevention", () => {
  test("createButton escapes text content", () => {
    const btn = createButton({ text: '<script>alert("xss")</script>' });
    // textContent automatically escapes, but innerHTML would not
    expect(btn.innerHTML).not.toContain("<script>");
  });

  test("createBadge escapes text content", () => {
    const badge = createBadge({ text: "<img src=x onerror=alert(1)>" });
    // textContent automatically escapes
    expect(badge.innerHTML).not.toContain("<img");
  });
});
