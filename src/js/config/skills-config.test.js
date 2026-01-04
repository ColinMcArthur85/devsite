import { skillsConfig } from "./skills-config";

describe("skillsConfig", () => {
  test("should have necessary properties for each skill", () => {
    Object.values(skillsConfig).forEach((skill) => {
      expect(skill).toHaveProperty("title");
      expect(skill).toHaveProperty("icon");
      expect(skill).toHaveProperty("color");
      expect(skill).toHaveProperty("class");
    });
  });

  test("should have descriptions for languages", () => {
    // Only languages (non-frameworks) must have descriptions in our current design
    Object.entries(skillsConfig).forEach(([key, skill]) => {
      if (!skill.isFramework) {
        expect(skill).toHaveProperty("description");
        expect(typeof skill.description).toBe("string");
        expect(skill.description.length).toBeGreaterThan(0);
      }
    });
  });

  test("TypeScript should have the correct icon and color", () => {
    expect(skillsConfig.TypeScript.icon).toBe("typescript");
    expect(skillsConfig.TypeScript.color).toBe("#3178c6");
  });

  test("MySQL should be marked as dynamic gradient", () => {
    expect(skillsConfig.MySQL.isGradient).toBe(true);
    expect(skillsConfig.MySQL).toHaveProperty("colorEnd");
  });

  test("React should be marked as framework", () => {
    expect(skillsConfig.React.isFramework).toBe(true);
  });

  test("PHP should have the coming soon badge", () => {
    expect(skillsConfig.PHP.badge).toBe("Coming Soon");
  });
});
