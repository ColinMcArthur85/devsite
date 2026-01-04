import { renderSkills } from "./skills-renderer";
import { skillsConfig } from "../config/skills-config";

jest.mock("../../data/skills.json", () => ({
  HTML: 1000,
  CSS: 2000,
  JavaScript: 1500,
  Python: 500,
}));

describe("renderSkills", () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="skills">
        <div class="grid"></div>
      </section>
    `;
    container = document.querySelector("#skills .grid");
  });

  test("should render skill cards into the container", () => {
    renderSkills();
    expect(container.innerHTML).toContain('data-skill="HTML"');
    expect(container.innerHTML).toContain('data-skill="Python"');
    expect(container.innerHTML).toContain('data-skill="JavaScript"');
  });

  test("should handle gradient titles correctly for MySQL", () => {
    renderSkills();
    const mysqlCard = container.querySelector('[data-skill="MySQL"]');
    expect(mysqlCard).toBeTruthy();
    const title = mysqlCard.querySelector(".card-title");
    expect(title.innerHTML).toContain('<span style="color: var(--color-mysql-blue)">My</span>');
    expect(title.innerHTML).toContain('<span style="color: var(--color-mysql-orange)">SQL</span>');
  });

  test("should handle gradient titles correctly for Python", () => {
    renderSkills();
    const pythonCard = container.querySelector('[data-skill="Python"]');
    expect(pythonCard).toBeTruthy();
    const title = pythonCard.querySelector(".card-title");
    expect(title.innerHTML).toContain('<span style="color: #3776ab">Py</span>');
    expect(title.innerHTML).toContain('<span style="color: #ffd343">thon</span>');
  });

  test("should calculate percentages correctly", () => {
    renderSkills();
    // Python count = 500 (mock) + 3500 (external) = 4000
    // Percentage = round((4000 / 25000) * 100) = 16%
    const pythonCard = container.querySelector('[data-skill="Python"]');
    const percentLabel = pythonCard.querySelector(".progress-percent");
    expect(percentLabel.textContent).toBe("16%");
  });

  test("should skip frameworks", () => {
    renderSkills();
    expect(container.innerHTML).not.toContain('data-skill="React"');
  });

  test("should do nothing if container is missing", () => {
    document.body.innerHTML = "";
    expect(() => renderSkills()).not.toThrow();
  });
});
