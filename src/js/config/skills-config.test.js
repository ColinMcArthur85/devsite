import { skillsConfig } from "./skills-config";

describe("skillsConfig", () => {
  test("should have necessary properties for each skill", () => {
    Object.values(skillsConfig).forEach((skill) => {
      expect(skill).toHaveProperty("title");
      expect(skill).toHaveProperty("icon");
      expect(skill).toHaveProperty("color");
      expect(skill).toHaveProperty("class");
      expect(skill).toHaveProperty("description");
      expect(skill).toHaveProperty("completedMilestones");
      expect(skill).toHaveProperty("nextMilestones");
      expect(Array.isArray(skill.completedMilestones)).toBe(true);
      expect(Array.isArray(skill.nextMilestones)).toBe(true);
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

  test("PHP should have completed milestones showing active backend experience", () => {
    expect(skillsConfig.PHP.completedMilestones.length).toBeGreaterThan(0);
    expect(skillsConfig.PHP.completedMilestones).toContain("MVC Architecture: Routing requests to Controllers");
  });

  test("Python should have correct gradient properties and description", () => {
    expect(skillsConfig.Python.isGradient).toBe(true);
    expect(skillsConfig.Python.color).toBe("#3776ab");
    expect(skillsConfig.Python.colorEnd).toBe("#ffd343");
    expect(skillsConfig.Python.title).toBe("Python");
    expect(skillsConfig.Python.description).toContain("Backend logic");
  });

  test("should define a highly premium AI Orchestration card", () => {
    expect(skillsConfig.AIOrchestration).toBeDefined();
    expect(skillsConfig.AIOrchestration.title).toBe("AI Orchestration");
    expect(skillsConfig.AIOrchestration.completedMilestones).toContain("Directing AI agents through structured BDD/TDD steps");
  });
});
