import { renderBuilds } from "./builds-renderer";

jest.mock("../../data/builds.json", () => [
  {
    title: "Test Build",
    description: "Does a <b>thing</b>.",
    icon: "robot",
    tags: ["PHP", "<script>"],
  },
]);

describe("renderBuilds", () => {
  beforeEach(() => {
    document.body.innerHTML = `<section id="builds"><div class="grid"></div></section>`;
  });

  test("renders title, description and tags", () => {
    renderBuilds();
    const grid = document.querySelector("#builds .grid");
    expect(grid.querySelectorAll("article")).toHaveLength(1);
    expect(grid.textContent).toContain("Test Build");
    expect(grid.querySelectorAll("li")).toHaveLength(2);
    expect(grid.innerHTML).toContain("sprite.svg#robot");
  });

  test("escapes HTML in content", () => {
    renderBuilds();
    const grid = document.querySelector("#builds .grid");
    expect(grid.querySelector("b")).toBeNull();
    expect(grid.querySelector("script")).toBeNull();
  });

  test("does nothing if container is missing", () => {
    document.body.innerHTML = "";
    expect(() => renderBuilds()).not.toThrow();
  });
});
