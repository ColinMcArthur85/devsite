# Devsite Wishlist

Ideas and backlog items for this project. The `wishlist-analyst` agent reads this file and recommends what to work on next.

**Format:** Add items with a short description of why it matters.

---

## Open Items

### DS-001 — Complete security hardening checklist
**Type:** Enhancement / Security
**Priority:** High
**Description:** Work through the remaining items in `docs/upgrade_plan/03_SECURITY_HARDENING.md` and `04_EXECUTION_CHECKLIST.md`. Verify CSP headers in `public/_headers`, input sanitization coverage across all user-facing inputs, and that the Unsplash API key is never exposed client-side.
**Notes:** The upgrade plan docs already exist — this is about completing the execution, not replanning.

### DS-002 — SEO improvements + structured data
**Type:** Feature
**Priority:** High
**Description:** Add proper meta tags, Open Graph tags, and JSON-LD structured data (Person, WebSite, CreativeWork for projects) to help the site show up in search and look good when shared on social.
**Notes:** Mentioned in `.agent/brainstorm.md`. High value for a portfolio site — employers and recruiters may share links.

### DS-003 — AI / LLM discoverability (SEO for AI)
**Type:** Feature
**Priority:** Medium
**Description:** Add `llms.txt` and ensure the site content is structured so AI tools (ChatGPT, Perplexity, etc.) can accurately answer questions about Colin's work. Complements DS-002.
**Notes:** Mentioned in `.agent/brainstorm.md` as "SEO for AI strategy". Emerging practice — worth exploring.

### DS-004 — Color contrast / accessibility audit
**Type:** Bug / Accessibility
**Priority:** Medium
**Description:** Run a WCAG AA audit (4.5:1 ratio for normal text) across the whole site. Fix any failing combinations. Check keyboard navigation flows end-to-end.
**Notes:** Mentioned in `.agent/brainstorm.md` as "Color contrast agent". Required for a professional portfolio — potential employers notice.

### DS-005 — Projects page: improve filtering UX
**Type:** Enhancement
**Priority:** Medium
**Description:** The filter-state and filter-view modules exist. Audit the current filtering UX — is it discoverable? Does it feel fast? Are there edge cases (no results, all filters cleared)?
**Notes:** Tests already exist in `__tests__/integration/projects-filter.test.js` — any change must keep them passing.

### DS-006 — Contact form: email delivery verification
**Type:** Bug / Enhancement
**Priority:** Medium
**Description:** Verify the contact form actually delivers emails end-to-end. Check the Cloudflare Worker handles errors gracefully (rate limiting, invalid input) and that the form gives useful feedback on success and failure.
**Notes:** `contact-form.js` and `contact-form-validation.js` exist. Integration test at `__tests__/integration/contact-form.test.js`.

### DS-007 — Add new portfolio projects
**Type:** Content
**Priority:** Medium
**Description:** Update `src/data/projects.js` with the latest projects (grocery_app, finance, health_journal, etc.). Ensure each entry has a good description, tags, and relevant links.
**Notes:** Quick win — pure data file edit, no logic changes needed. High value for the portfolio.

### DS-008 — Theme toggle: persist preference across page loads
**Type:** Enhancement
**Priority:** Low
**Description:** Verify the dark/light mode toggle persists via localStorage. If it doesn't, add it.
**Notes:** Integration test at `__tests__/integration/theme-toggle.test.js`. Should be straightforward.

### DS-009 — Keep skills data current
**Type:** Content / Tooling
**Priority:** Low
**Description:** A `scripts/update_skill_counts.js` script exists. Run it, audit the output, and update `src/data/skills.json` to reflect Colin's current skillset.
**Notes:** Low effort — run the script, review, update if needed.

### DS-010 — Performance audit
**Type:** Enhancement
**Priority:** Low
**Description:** Run Lighthouse on the live site and address obvious wins: image formats (WebP), lazy loading, JS bundle size, render-blocking resources.
**Notes:** Not urgent — Cloudflare CDN already helps a lot. But a 95+ Lighthouse score on a portfolio site is a credibility signal.

### DS-011 — Interactive MySQL Query Profiler & Indexing Lab
**Type:** Feature / Interactive Lab
**Priority:** High (Stratosphere Idea 1)
**Description:** Expand the PHP MVC Request Lifecycle Visualizer to include a live database optimization module. When selecting the "Database" step, visitors can toggle a "Simulate Missing Index" button. This triggers a visual plan change: an active index trace changes to a heavy, red-warning "Table Scan (10,000 rows examined)", causing mock query performance time to jump from 0.04ms (index hit) to 240ms (slow table scan).
**Notes:** Exceptional recruiter-magnet that proves advanced understanding of relational database optimization, query plan analysis, indexing strategies, and database scalability.

### DS-012 — Real-Time Webhook & WebSockets Sandbox Terminal
**Type:** Feature / Interactive Lab
**Priority:** High (Stratosphere Idea 2)
**Description:** Build a highly polished, interactive Webhook Sandbox Receiver panel mimicking premium event-driven backends. Visitors can trigger simulated events (e.g. "Stripe payment success", "GitHub repository push", "Rollbar critical exception") and watch payloads stream in real-time. A side-by-side PHP class script highlights signature-checking, secure cryptographic validation, and database State ingestion.
**Notes:** Showcases competency in asynchronous systems, third-party API integrations, robust event verification security protocols, and console parsing.

### DS-013 — AI Orchestrator Playroom
**Type:** Feature / Interactive Lab
**Priority:** High (Stratosphere Idea 3)
**Description:** Build a dual-pane AI Orchestrator playroom showing recruiters your cutting-edge pair-programming methodology with LLMs. The left pane animates a dialogue of Colin giving high-level architectural directions (TDD, BDD, OWASP security checks) to debug a mock error. The right pane shows the simulated AI generating failing Jest tests first, writing minimal code, reading stack trace variables, and refactoring to green.
**Notes:** High impact signal demonstrating your ability to direct and pair-program with AI as a senior engineering lead focusing on quality, architecture, and robust BDD/TDD processes.

### DS-014 — "SEO for AI" Crawler Console
**Type:** Feature
**Priority:** Medium (Stratosphere Idea 4)
**Description:** Implement a dynamic AI discoverability console displaying persons, creativeWorks, and achievements parsed specifically for AI search engines. Visualizes exactly how Claude, ChatGPT, or Perplexity ingest your portfolio via person structured JSON-LD and your `llms.txt` config file. Highlights standard checkmarks indicating the profile is 100% optimized for LLM indexing.
**Notes:** Establishes you as a forward-thinking full-stack engineer leading the industry in AI discoverability, structure-mapping, and search optimization for the LLM era.

---

## Completed

*(Items move here after they ship — include the date and branch name)*
