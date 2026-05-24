# WISH-011 — PHP MVC Request Visualizer and Skills Growth System

> **Spec Purpose:** Define the design, user journey, and data structures for building the PHP MVC Lifecycle Visualizer and modernizing the Skills Display with a growth roadmap and AI Orchestration focus.

---

## 1. Problem Statement

Colin's portfolio currently displays raw "Lines of Code" counts as progress bars. In the modern web development era, especially with agentic coding assistants, flat line count is a vanity metric that does not prove engineering mastery. 

Furthermore, Colin has recently gained significant hands-on experience building production apps using PHP and MySQL—but because this code lives in private team repositories, his static portfolio fails to showcase his backend system architectural skills. Recruiters and visitors have no visual, immediate way to see his backend capabilities.

---

## 2. Solution Overview

We are building a two-part showcase system:
1. **The PHP MVC Lifecycle Visualizer:** A beautiful, highly interactive frontend application hosted on `pages/showcase.html` that simulates a live `GET /api/v1/projects?category=php` backend request. Visitors can see a visual, animated path of a request traveling through Router ➔ Middleware ➔ Controller ➔ ORM/Model ➔ Database query ➔ JSON output, with a live side-by-side code editor displaying matching production-grade PHP and SQL source code.
2. **Evolved Skills & Growth System:** A complete redesign of the homepage/skills page cards. Out go the flat lines-of-code progress bars; in come **Architectural Checkpoints** (completed vs. next milestones) and a prominent **AI Orchestration & DevSecOps** card highlighting Colin's senior-level developer workflow capabilities (debugging, TDD, stack trace audits).

---

## 3. User Journey

### A. Evolved Home Page / Skills Discovery
1. The visitor lands on the homepage and scrolls to the revamped **Languages Used / Skills** section.
2. Instead of lines of code progress bars, they see clean cards with a checklist of **Completed Milestones** (e.g. *"MVC Routing"*, *"TDD with Jest"*, *"SQL Joins & Indexing"*) and an explicit **Next Milestones** growth roadmap.
3. They see a glowing card titled **AI Orchestration & DevSecOps** showcasing Colin's ability to direct AI to architect clean, secure systems, troubleshoot webhooks, and audit stack traces using Rollbar.
4. In the **Projects** section, they spot a sleek, high-impact callout card: **“Interactive Demo: Inspect how a modern PHP MVC framework handles request lifecycles. [Launch Visualizer]”**.

### B. The PHP MVC Visualizer Page (`pages/showcase.html`)
1. The visitor lands on `/pages/showcase.html` and is greeted by a dark, high-contrast, premium console layout.
2. On the left is an **Interactive Node Diagram** (Router, Middleware, Controller, Model, Database, Response).
3. On the right is a **Mock Code Editor** (styled with Fira Code, tabs for `Router.php`, `SecurityMiddleware.php`, `ProjectController.php`, `Project.php`, `schema.sql`).
4. The visitor clicks **"Trigger GET Request"** on a mock browser address bar.
5. A bright, glowing light pulse flows dynamically through the nodes. 
6. As each node lights up:
   * The editor panel automatically switches to the corresponding PHP file.
   * Key lines of code (e.g., matching middleware checks or database query executions) are highlighted.
   * If they click any node manually, the visualizer jumps to that step and shows the respective code.

---

## 4. Acceptance Criteria

- [ ] **Interactive Visualizer Page:** Fully responsive, premium-designed showcase page (`src/pages/showcase.html`).
- [ ] **Node Animations:** Canvas-based or SVG-based interactive request flow with smooth active pulses and hover states.
- [ ] **Code Syncing:** Code tabs switch and highlight specific lines synchronously based on the active node state.
- [ ] **Checklist Redesign:** Home and Skills pages display competency checkboxes and growth roadmap instead of raw lines-of-code.
- [ ] **AI Orchestrator Card:** glowing high-contrast card outlining human-in-the-loop senior engineering workflows (Rollbar, var_dumps, TDD).
- [ ] **Strict Security Standards:** Sanitize all user-input variables (even mockup fields) using `src/js/utils/sanitize.js`.
- [ ] **TDD/BDD Verification:** Write Jest unit and integration tests to verify visualizer state management, and ensure overall test coverage remains ≥60%.

---

## 5. Out of Scope

- A real running PHP backend or server-side database (this is purely client-side simulation).
- An editable PHP sandbox (we are focus-directing recruiters on a clean, pre-authored, production-grade request path).

---

## 6. Edge Cases & Error States

| Scenario | Expected behavior |
|---|---|
| Visitor clicks nodes out of order during active animation | Gracefully halt current step, jump instantly to the clicked node, update active tab and highlights. |
| User enters a custom query param in mock URL | Sanitize search query input instantly using `escapeHtml` and print it dynamically in the visualizer's "Controller Log" to prove active input protection. |
| Mobile layout viewing visualizer | Stacks the flow graph above/below the code editor instead of side-by-side; fits code comfortably with overflow scrolling. |

---

## 7. Ubiquitous Language Check

| Term used in this spec | Canonical form | Notes |
|---|---|---|
| **Page** | Page | Home, Skills, and the new Showcase page. |
| **Component** | Component | Visualizer graph, Code editor panel, Skill checklist cards. |
| **Visitor** | Visitor | Unauthenticated user looking at Colin's portfolio. |

---

## 8. Colin's Preferences Walkthrough

| # | Principle | Applies? | How this spec addresses it |
|---|---|---|---|
| 1 | Saturated Grays & Dark UI | Yes | Saturated dark blues (#0a0f1a) with subtle shadows and colored gradients. |
| 2 | Human-in-the-loop AI | Yes | Highlighted directly in the AI Orchestration card and documented in Git workflows. |
| 3 | Security-first input | Yes | Active validation/sanitization in the mock browser address bar using `sanitize.js`. |

---

## 9. Schema / Data Up-Front

No database table additions since we are static. However, we will create a structured configuration object for the skills/milestones and code blocks:

```javascript
// src/js/config/showcase-code.js
export const mvcStepsCode = {
  router: {
    title: "Router.php",
    code: `// ... routing declarations`,
    highlights: [5, 6, 7]
  },
  // ... middleware, controller, model, sql
};
```

And update `src/js/config/skills-config.js` to store checkpoints:
```javascript
export const skillsConfig = {
  PHP: {
    title: "PHP",
    checkpoints: [
      { text: "Object-Oriented Design (OOP)", done: true },
      { text: "MVC Architecture & Routing", done: true },
      { text: "API Integration & Webhooks", done: true },
      { text: "PHPUnit Testing & TDD", done: false } // Milestone/Growth Roadmap
    ]
  }
};
```

---

## 10. Files That Will Change

| File | Change | Why |
|---|---|---|
| `[NEW] src/pages/showcase.html` | Create | Implements the dedicated Showcase page. |
| `[NEW] src/js/modules/mvc-visualizer.js` | Create | Implements visualizer logic and canvas/SVG state machine. |
| `[NEW] src/js/config/showcase-code.js` | Create | Stores the simulated high-quality PHP/SQL code blocks. |
| `[MODIFY] src/index.html` | Modify | Add callout card under Projects & update Skills cards markup. |
| `[MODIFY] src/js/config/skills-config.js` | Modify | Evolve to store checklist milestones and AI card configuration. |
| `[MODIFY] src/js/renderers/skills-renderer.js` | Modify | Evolve to render checkpoints instead of raw lines-of-code. |
| `[NEW] src/js/modules/mvc-visualizer.test.js` | Create | Jest unit tests for visualizer logic. |

---

## 11. Access Control

- Publicly accessible to all portfolio visitors.

---

## 12. Notes for Implementation

- Keep the design aligned with your existing glassmorphism cards and lighting system.
- The visualizer code blocks should look incredibly clean and realistic—featuring namespaces, dependency injection, and security filtering—to represent Colin's actual professional growth.
