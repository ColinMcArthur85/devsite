import { renderFeatures } from "./features-renderer";

jest.mock("../../data/features.json", () => [
  {
    title: "Fast Performance",
    description: "Lightning fast loads.",
    icon: "zap",
  },
]);

describe("renderFeatures", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="features">
        <div class="grid"></div>
      </div>
    `;
  });

  test("should render features into the container", () => {
    renderFeatures();
    const grid = document.querySelector("#features .grid");
    expect(grid.innerHTML).toContain("Fast Performance");
    expect(grid.innerHTML).toContain("Lightning fast loads.");
    expect(grid.innerHTML).toContain("zap");
  });

  test("should do nothing if container is missing", () => {
    document.body.innerHTML = "";
    expect(() => renderFeatures()).not.toThrow();
  });
});
