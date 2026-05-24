import { renderSkills } from "./skills-renderer";
import { skillsConfig } from "../config/skills-config";

describe("renderSkills", () => {
  let skillsContainer;
  let frameworksContainer;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="skills">
        <div class="grid"></div>
      </section>
      <section id="frameworks">
        <div class="grid"></div>
      </section>
    `;
    skillsContainer = document.querySelector("#skills .grid");
    frameworksContainer = document.querySelector("#frameworks .grid");
  });

  test("should render skill cards into the skills container", () => {
    renderSkills();
    expect(skillsContainer.innerHTML).toContain('data-skill="HTML"');
    expect(skillsContainer.innerHTML).toContain('data-skill="Python"');
    expect(skillsContainer.innerHTML).toContain('data-skill="JavaScript"');
    expect(skillsContainer.innerHTML).toContain('data-skill="AIOrchestration"');
  });

  test("should handle gradient titles correctly for MySQL", () => {
    renderSkills();
    const mysqlCard = skillsContainer.querySelector('[data-skill="MySQL"]');
    expect(mysqlCard).toBeTruthy();
    const title = mysqlCard.querySelector(".card-title");
    expect(title.innerHTML).toContain('<span style="color: var(--color-mysql-blue)">My</span>');
    expect(title.innerHTML).toContain('<span style="color: var(--color-mysql-orange)">SQL</span>');
  });

  test("should handle gradient titles correctly for Python", () => {
    renderSkills();
    const pythonCard = skillsContainer.querySelector('[data-skill="Python"]');
    expect(pythonCard).toBeTruthy();
    const title = pythonCard.querySelector(".card-title");
    expect(title.innerHTML).toContain('<span style="color: #3776ab">Py</span>');
    expect(title.innerHTML).toContain('<span style="color: #ffd343">thon</span>');
  });

  test("should render checklists for competencies instead of line progress bars", () => {
    renderSkills();
    const htmlCard = skillsContainer.querySelector('[data-skill="HTML"]');
    expect(htmlCard).toBeTruthy();
    
    // Verify that checkpoint list exists and lists completed items
    const list = htmlCard.querySelector("ul");
    expect(list).toBeTruthy();
    expect(list.innerHTML).toContain("Semantic elements structuring");
  });

  test("should render React and Tailwind dynamic cards inside frameworks container", () => {
    renderSkills();
    expect(frameworksContainer.innerHTML).toContain('data-skill="React"');
    expect(frameworksContainer.innerHTML).toContain('data-skill="Tailwind"');
  });

  test("should do nothing if container is missing", () => {
    document.body.innerHTML = "";
    expect(() => renderSkills()).not.toThrow();
  });
});
