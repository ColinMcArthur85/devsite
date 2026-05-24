import { showcaseCode } from "../config/showcase-code.js";
import { escapeHtml } from "../utils/sanitize.js";

// Mapping steps to code block keys
const stepMapping = {
  router: "router",
  middleware: "middleware",
  controller: "controller",
  model: "model",
  database: "database"
};

// Simulated logs mapping
const logsMapping = {
  router: {
    ready: "[System]: HTTP GET request received at route endpoint. Parsing route rules...",
    info: "Route MATCH: 'GET /api/v1/projects' routed to ProjectController@index."
  },
  middleware: {
    ready: "[System]: Middleware filter boundaries activated. Examining inputs...",
    info: "Input SANITIZED: Query parameter 'category' checked. Security filters clear."
  },
  controller: {
    ready: "[System]: Request logic handed off to Controller execution container...",
    info: "Controller processing business logic. Requesting project matching records from Model."
  },
  model: {
    ready: "[System]: Model initializing SQL prepared query statements...",
    info: "Query parameters securely bound via PDO bindings. Directing query execution to MySQL."
  },
  database: {
    ready: "[System]: MySQL Server querying datasets under strict indexes...",
    info: "MySQL Result: Query matched active records successfully. Primary index hit. Rows returned: 3."
  }
};

export class MvcVisualizer {
  constructor() {
    this.currentNode = null;
    this.animationTimer = null;
    this.isAnimating = false;
    this.selectedCategory = "php";

    this.initElements();
    if (this.btnRun) {
      this.initEvents();
      this.initTabs();
      this.selectNode("router");
      setTimeout(() => this.drawLines(), 300);
    }
  }

  initElements() {
    this.btnRun = document.getElementById("btnRunRequest");
    this.paramCategory = document.getElementById("paramCategory");
    this.nodes = document.querySelectorAll(".visualizer-node");
    this.tabsContainer = document.getElementById("editor-tabs");
    this.codeContent = document.getElementById("code-content");
    this.lineNumbers = document.getElementById("line-numbers");
    this.explainerTitle = document.getElementById("explainer-title");
    this.explainerDesc = document.getElementById("explainer-desc");
    this.consoleLogs = document.getElementById("console-logs");
    this.consoleStatus = document.getElementById("console-status");
  }

  initEvents() {
    this.btnRun.addEventListener("click", () => this.runSimulation());
    this.paramCategory.addEventListener("change", (e) => {
      this.selectedCategory = e.target.value;
      this.logToConsole(`[Console]: Search parameter switched to category='${this.selectedCategory}'`);
    });

    this.nodes.forEach(node => {
      node.addEventListener("click", () => {
        if (this.isAnimating) this.stopSimulation();
        const step = node.getAttribute("data-node");
        this.selectNode(step);
      });
    });

    window.addEventListener("resize", () => this.drawLines());
  }

  initTabs() {
    if (!this.tabsContainer) return;
    this.tabsContainer.innerHTML = Object.entries(showcaseCode)
      .map(([key, item]) => `
        <button class="editor-tab flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border border-transparent transition-all" data-tab="${key}">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c0 1.1-.9-2-2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          ${escapeHtml(item.filename)}
        </button>
      `)
      .join("");

    this.tabs = this.tabsContainer.querySelectorAll(".editor-tab");
    this.tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        if (this.isAnimating) this.stopSimulation();
        const tabKey = tab.getAttribute("data-tab");
        // Find corresponding visualizer node if applicable
        const matchingNode = Object.keys(stepMapping).find(k => stepMapping[k] === tabKey);
        if (matchingNode) {
          this.selectNode(matchingNode);
        } else {
          this.renderCode(tabKey);
        }
      });
    });
  }

  selectNode(step) {
    this.currentNode = step;

    // Highlight visual nodes
    this.nodes.forEach(node => {
      const nodeStep = node.getAttribute("data-node");
      const indicator = node.querySelector(".pulse-indicator");
      
      if (nodeStep === step) {
        node.className = "visualizer-node flex items-center gap-4 p-4 rounded-2xl border border-purple-500/40 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.1)] dark:border-purple-500/30 dark:bg-purple-950/10 cursor-pointer scale-[1.02] transition-all duration-300";
        if (indicator) indicator.className = "pulse-indicator h-2.5 w-2.5 rounded-full bg-purple-500 animate-ping";
      } else {
        node.className = "visualizer-node flex items-center gap-4 p-4 rounded-2xl border border-light-border bg-light-surface hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/80 cursor-pointer transition-all duration-300";
        if (indicator) indicator.className = "pulse-indicator h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700";
      }
    });

    const codeKey = stepMapping[step];
    if (codeKey) {
      this.renderCode(codeKey);
    }
    
    // Instantly sync the SVG connection lines matching any minor layout transitions
    setTimeout(() => this.drawLines(), 50);
  }

  renderCode(key) {
    const data = showcaseCode[key];
    if (!data) return;

    // Highlight active tab
    this.tabs.forEach(tab => {
      const tabKey = tab.getAttribute("data-tab");
      if (tabKey === key) {
        tab.className = "editor-tab flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-[#131b2d] text-white border border-slate-800 shadow-md";
      } else {
        tab.className = "editor-tab flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border border-transparent text-slate-500 hover:text-slate-300";
      }
    });

    // Populate descriptions
    if (this.explainerTitle) this.explainerTitle.textContent = data.filename;
    if (this.explainerDesc) this.explainerDesc.textContent = data.description;

    // Highlight line numbers & populate code content
    let lines = data.code.split("\n");
    
    // Check dynamic parameters for security showcases
    if (key === "middleware" && this.selectedCategory === "malicious_script") {
      lines = lines.map(line => {
        if (line.includes("$input = $request->all();")) {
          return `${line} // Injected Parameter: '<script>alert(1)</script>'`;
        }
        return line;
      });
    }

    if (this.lineNumbers) {
      this.lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join("");
    }

    if (this.codeContent) {
      this.codeContent.innerHTML = lines.map((line, i) => {
        const isHighlighted = data.highlights.includes(i + 1);
        const escapedLine = escapeHtml(line);
        if (isHighlighted) {
          return `<div class="bg-purple-500/10 border-l-2 border-purple-500 -mx-6 px-6 font-semibold text-white">${escapedLine || " "}</div>`;
        }
        return `<div>${escapedLine || " "}</div>`;
      }).join("");
    }
  }

  logToConsole(msg, type = "system") {
    if (!this.consoleLogs) return;
    const time = new Date().toLocaleTimeString().split(" ")[0];
    const colorClass = type === "error" 
      ? "text-red-400" 
      : type === "success" 
        ? "text-emerald-400 font-bold" 
        : type === "alert"
          ? "text-purple-400 font-semibold"
          : "text-slate-400";

    const logEntry = document.createElement("div");
    logEntry.className = `${colorClass} mt-1.5`;
    logEntry.innerHTML = `<span>[${time}]</span> <span class="font-mono">${msg}</span>`;
    
    this.consoleLogs.appendChild(logEntry);
    this.consoleLogs.scrollTop = this.consoleLogs.scrollHeight;
  }

  runSimulation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.btnRun.disabled = true;
    this.btnRun.innerHTML = "<span>Processing...</span>";
    this.consoleStatus.className = "h-2 w-2 rounded-full bg-yellow-500 animate-pulse";
    
    if (this.consoleLogs) this.consoleLogs.innerHTML = "";
    this.logToConsole("[System]: Bootstrapping simulated application engine...");

    const steps = ["router", "middleware", "controller", "model", "database"];
    let index = 0;

    const executeStep = () => {
      if (index >= steps.length) {
        this.finishSimulation();
        return;
      }

      const step = steps[index];
      this.selectNode(step);
      
      const log = logsMapping[step];
      this.logToConsole(log.ready);
      
      // Dynamic logic triggers for SQL indexing XSS sanitization
      setTimeout(() => {
        if (step === "middleware" && this.selectedCategory === "malicious_script") {
          this.logToConsole("⚠️ WARNING XSS: Malicious Script Tag detected in parameters! Stripping HTML tags...", "error");
          this.logToConsole("Input SECURED: Stripped parameter safely to '&lt;script&gt;alert(1)&lt;/script&gt;' ➔ 'alert(1)'.", "alert");
        } else if (step === "database" && this.selectedCategory !== "all") {
          this.logToConsole(`Index hit: idx_project_category on table 'projects' (category = '${this.selectedCategory}').`);
          this.logToConsole(log.info);
        } else {
          this.logToConsole(log.info);
        }

        index++;
        this.animationTimer = setTimeout(executeStep, 1500);
      }, 800);
    };

    executeStep();
  }

  finishSimulation() {
    this.isAnimating = false;
    this.btnRun.disabled = false;
    this.btnRun.innerHTML = `<span>Run Request</span>
      <svg class="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>`;
    
    this.consoleStatus.className = "h-2 w-2 rounded-full bg-emerald-500";
    
    // Add raw output rendering tab dynamically!
    this.logToConsole("[System]: Response constructed securely. Parsing JSON object standard output...", "success");

    const categoryText = this.selectedCategory === "malicious_script" ? "alert(1)" : this.selectedCategory;
    const jsonOutput = {
      status: "success",
      timestamp: Date.now(),
      query: `GET /api/v1/projects?category=${categoryText}`,
      data: [
        { id: 104, title: "Timesheet SQL Tracker", category: "php", status: "active" },
        { id: 107, title: "Devsite Portal Upgrade", category: "typescript", status: "active" }
      ]
    };

    setTimeout(() => {
      if (this.explainerTitle) this.explainerTitle.textContent = "Response Payload (JSON)";
      if (this.explainerDesc) this.explainerDesc.textContent = "Standard secure output returned to client console container.";
      if (this.lineNumbers) this.lineNumbers.innerHTML = "<div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>";
      if (this.codeContent) {
        this.codeContent.innerHTML = `<div class="text-emerald-400 font-semibold">${escapeHtml(JSON.stringify(jsonOutput, null, 2))}</div>`;
      }
      this.logToConsole("HTTP 200 OK - Secure Response Returned Successfully.", "success");
    }, 400);
  }

  stopSimulation() {
    this.isAnimating = false;
    this.btnRun.disabled = false;
    this.btnRun.innerHTML = `<span>Run Request</span>
      <svg class="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>`;
    
    this.consoleStatus.className = "h-2 w-2 rounded-full bg-emerald-500 animate-pulse";
    clearTimeout(this.animationTimer);
    this.logToConsole("[System]: Simulation interrupted by visitor node selections.");
  }

  drawLines() {
    const svg = document.getElementById("visualizer-lines");
    const nodeList = document.getElementById("node-list");
    if (!svg || !nodeList) return;

    svg.innerHTML = "";
    const nodes = Array.from(this.nodes);
    
    // Set SVG dynamic sizing relative to bounding container
    const containerRect = svg.getBoundingClientRect();

    for (let i = 0; i < nodes.length - 1; i++) {
      const badge1 = nodes[i].querySelector(".node-badge");
      const badge2 = nodes[i + 1].querySelector(".node-badge");
      if (!badge1 || !badge2) continue;

      const rect1 = badge1.getBoundingClientRect();
      const rect2 = badge2.getBoundingClientRect();

      // Find center coordinate relative to absolute SVG canvas
      const x1 = rect1.left + rect1.width / 2 - containerRect.left;
      const y1 = rect1.bottom - containerRect.top;
      const x2 = rect2.left + rect2.width / 2 - containerRect.left;
      const y2 = rect2.top - containerRect.top;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
      path.setAttribute("stroke", "var(--color-primary, #6366f1)");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-dasharray", "6 4");
      
      svg.appendChild(path);
    }
  }
}

// Auto-bootstrapper
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("btnRunRequest")) {
    window.visualizer = new MvcVisualizer();
  }
});
