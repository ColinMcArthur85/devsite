/**
 * @file mvc-visualizer.test.js
 * @description Unit tests for the PHP MVC Request Lifecycle Visualizer state machine.
 */

import { MvcVisualizer } from "./mvc-visualizer.js";
import { showcaseCode } from "../config/showcase-code.js";

describe("MvcVisualizer Controller", () => {
  let visualizer;

  beforeEach(() => {
    // Setup Mock DOM elements using Jest JSDOM
    document.body.innerHTML = `
      <button id="btnRunRequest">Run Request</button>
      <select id="paramCategory">
        <option value="php" selected>php</option>
        <option value="mysql">mysql</option>
        <option value="malicious_script">malicious</option>
      </select>
      
      <div id="visualizer-lines"></div>
      
      <div id="node-list">
        <div class="visualizer-node" data-node="router"><span class="pulse-indicator"></span><span class="node-badge"></span></div>
        <div class="visualizer-node" data-node="middleware"><span class="pulse-indicator"></span><span class="node-badge"></span></div>
        <div class="visualizer-node" data-node="controller"><span class="pulse-indicator"></span><span class="node-badge"></span></div>
        <div class="visualizer-node" data-node="model"><span class="pulse-indicator"></span><span class="node-badge"></span></div>
        <div class="visualizer-node" data-node="database"><span class="pulse-indicator"></span><span class="node-badge"></span></div>
      </div>

      <div id="editor-tabs"></div>
      <div id="code-content"></div>
      <div id="line-numbers"></div>
      
      <div id="explainer-title"></div>
      <div id="explainer-desc"></div>
      
      <div id="console-logs"></div>
      <span id="console-status"></span>
    `;

    visualizer = new MvcVisualizer();
  });

  afterEach(() => {
    jest.clearAllTimers();
    if (visualizer) {
      visualizer.stopSimulation();
    }
  });

  describe("Initialization", () => {
    test("instantiates successfully and hooks elements", () => {
      expect(visualizer).toBeDefined();
      expect(visualizer.btnRun).not.toBeNull();
      expect(visualizer.currentNode).toBe("router");
      expect(visualizer.isAnimating).toBe(false);
    });

    test("populates code tabs inside container dynamically", () => {
      const tabs = document.querySelectorAll(".editor-tab");
      // Expect 5 tabs representing pre-configured simulated files
      expect(tabs.length).toBe(5);
      expect(tabs[0].textContent).toContain("routes/api.php");
    });
  });

  describe("Node Selection & Code Rendering", () => {
    test("selectNode highlights active node card", () => {
      visualizer.selectNode("middleware");
      
      const middlewareNode = document.querySelector('[data-node="middleware"]');
      const routerNode = document.querySelector('[data-node="router"]');
      
      expect(middlewareNode.className).toContain("border-purple-500");
      expect(routerNode.className).not.toContain("border-purple-500");
      expect(visualizer.currentNode).toBe("middleware");
    });

    test("renderCode switches active editor code tabs", () => {
      visualizer.renderCode("controller");

      const controllerTab = document.querySelector('[data-tab="controller"]');
      const routerTab = document.querySelector('[data-tab="router"]');

      expect(controllerTab.className).toContain("bg-[#131b2d]");
      expect(routerTab.className).not.toContain("bg-[#131b2d]");
    });

    test("renderCode populates and highlights specific lines of code", () => {
      visualizer.renderCode("router");

      const codeContainer = document.getElementById("code-content");
      const lines = codeContainer.querySelectorAll("div");

      // Verify that code is written
      expect(lines.length).toBeGreaterThan(0);
      
      // Check if highlights are applied
      const highlighted = codeContainer.querySelector(".border-purple-500");
      expect(highlighted).not.toBeNull();
    });
  });

  describe("Console Logs & Diagnostics", () => {
    test("logToConsole appends system entries with timestamps", () => {
      visualizer.logToConsole("Test diagnostic event entry", "success");

      const logBox = document.getElementById("console-logs");
      expect(logBox.textContent).toContain("Test diagnostic event entry");
    });
  });

  describe("Simulated Parameters & Sanitization Boundaries", () => {
    test("paramCategory change triggers active category switch", () => {
      const select = document.getElementById("paramCategory");
      select.value = "mysql";
      select.dispatchEvent(new Event("change"));

      expect(visualizer.selectedCategory).toBe("mysql");
      
      const logBox = document.getElementById("console-logs");
      expect(logBox.textContent).toContain("category='mysql'");
    });

    test("runs malicious inputs safely through the escaping filter", () => {
      visualizer.selectedCategory = "malicious_script";
      visualizer.renderCode("middleware");

      const codeContainer = document.getElementById("code-content");
      expect(codeContainer.textContent).toContain("// Injected Parameter: '<script>alert(1)</script>'");
    });
  });

  describe("Button States", () => {
    test("should preserve essential layout classes and structure during simulation states", () => {
      // Arrange
      const btn = document.getElementById("btnRunRequest");
      btn.className = "btn-console justify-center gap-2 relative overflow-hidden group whitespace-nowrap min-w-[130px] flex-shrink-0";

      // Act & Assert - Initial State
      expect(btn.className).toBe("btn-console justify-center gap-2 relative overflow-hidden group whitespace-nowrap min-w-[130px] flex-shrink-0");

      // Act & Assert - Processing State
      visualizer.runSimulation();
      expect(btn.innerHTML).toContain("Processing...");
      expect(btn.className).toBe("btn-console justify-center gap-2 relative overflow-hidden group whitespace-nowrap min-w-[130px] flex-shrink-0");

      // Act & Assert - Finished State
      visualizer.finishSimulation();
      expect(btn.innerHTML).toContain("Run Request");
      expect(btn.className).toBe("btn-console justify-center gap-2 relative overflow-hidden group whitespace-nowrap min-w-[130px] flex-shrink-0");
    });
  });
});
