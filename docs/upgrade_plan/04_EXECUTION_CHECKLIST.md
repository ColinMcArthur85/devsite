# Execution Checklist: devsite Upgrade Plan

**Document Version:** 1.1  
**Last Updated:** 2026-01-01  
**Status:** In Progress - Phase 0 Complete

---

## Overview

This is the master execution checklist for upgrading devsite with TDD, BDD, and security best practices. Complete items in order, checking off each as you go.

**Legend:**
- 🔴 **CRITICAL** - Security or blocking issue
- 🟠 **HIGH** - Important for code quality
- 🟡 **MEDIUM** - Recommended improvement
- 🟢 **LOW** - Nice to have

---

## Phase 0: Prerequisites ✅

### Environment Setup

- [x] **0.1** Verify Node.js version is 18+ (`node -v`) — *v24.11.1*
- [x] **0.2** Verify npm is up to date (`npm -v`) — *v11.6.2*
- [x] **0.3** Create backup branch (`git checkout -b backup/pre-upgrade`)
- [x] **0.4** Return to main branch (`git checkout main`)
- [x] **0.5** Create upgrade branch (`git checkout -b feature/tdd-security-upgrade`)

---

## Phase 1: Test Infrastructure ✅

> Reference: [01_TDD_STRATEGY.md](./01_TDD_STRATEGY.md)

### Jest Configuration

- [x] **1.1** Install additional test dependencies
  ```bash
  npm install --save-dev jest-environment-jsdom identity-obj-proxy jest-junit
  ```

- [x] **1.2** Update `jest.config.js` with enhanced configuration
  - Add `testEnvironment: "jsdom"`
  - Add coverage configuration
  - Add module name mapping
  - Add setup file reference

- [x] **1.3** Create `jest.setup.js` with global mocks
  - localStorage mock
  - IntersectionObserver mock
  - matchMedia mock

- [x] **1.4** Create `__mocks__/fileMock.js`

- [x] **1.5** Verify test infrastructure works — *2 tests passing*
  ```bash
  npm test
  ```

- [x] **1.6** Update `package.json` with new test scripts
  - `test:watch`
  - `test:coverage`
  - `test:ci`
  - `test:unit`
  - `test:integration`

### Test Directory Structure

- [x] **1.7** Create directory structure
  ```bash
  mkdir -p __tests__/integration
  mkdir -p __tests__/security
  mkdir -p __tests__/a11y
  mkdir -p src/js/utils
  mkdir -p __mocks__
  ```

---

## Phase 2: Security Foundation ✅ (Partial)

> Reference: [03_SECURITY_HARDENING.md](./03_SECURITY_HARDENING.md)

### HTTP Security Headers

- [x] **2.1** Create `public/_headers` file with security headers
  - X-Frame-Options
  - X-Content-Type-Options
  - Content-Security-Policy
  - Referrer-Policy
  - Permissions-Policy

- [ ] **2.2** Deploy to Cloudflare Pages (staging) — *pending deployment*
- [ ] **2.3** Verify headers in browser DevTools (Network tab) — *pending deployment*

### Sanitization Utility

- [x] **2.4** **[TDD: RED]** Create `src/js/utils/sanitize.test.js`
  - Write failing tests for escapeHtml
  - Write failing tests for stripTags
  - Write failing tests for sanitizeForUrl
  - Write failing tests for XSS vectors

- [x] **2.5** Run tests, confirm they fail — *confirmed: "Cannot find module"*
  ```bash
  npm test -- sanitize
  ```

- [x] **2.6** **[TDD: GREEN]** Create `src/js/utils/sanitize.js`
  - Implement escapeHtml
  - Implement stripTags
  - Implement sanitizeForUrl
  - Implement sanitizeText

- [x] **2.7** Run tests, confirm they pass — *47 tests passing*
  ```bash
  npm test -- sanitize
  ```

- [x] **2.8** **[TDD: REFACTOR]** Optimize if needed, tests still pass — *49 total tests passing*

---

## Phase 3: API Security ✅ (Partial)

> Reference: [03_SECURITY_HARDENING.md](./03_SECURITY_HARDENING.md) Section 4

### Unsplash API Hardening

- [x] **3.1** **[TDD: RED]** Enhance `functions/api/unsplash.test.js`
  - Add input validation tests
  - Add rate limiting tests
  - Add security header tests
  - Add error handling tests

- [x] **3.2** Run tests, confirm they fail — *"Cannot find module './unsplash-helpers'"*
  ```bash
  npm test -- unsplash
  ```

- [x] **3.3** **[TDD: GREEN]** Update `functions/api/unsplash.js`
  - Add input sanitization
  - Add rate limiting logic
  - Add proper CORS configuration
  - Add error message sanitization

- [x] **3.4** Run tests, confirm they pass — *24 tests passing*

- [ ] **3.5** Test locally with Wrangler — *pending manual testing*
  ```bash
  npm run dev
  ```

- [ ] **3.6** Verify API works in Image Search page — *pending manual testing*

### Environment Variables

- [x] **3.7** Verify `.dev.vars` is in `.gitignore` — *confirmed line 16*
- [ ] **3.8** Configure Cloudflare Dashboard environment variables — *pending deployment*
  - `UNSPLASH_ACCESS_KEY`
  - `ALLOWED_ORIGIN`
  - `ENVIRONMENT`

---

## Phase 4: Core Unit Tests ✅

> Reference: [02_BDD_FEATURES.md](./02_BDD_FEATURES.md)

### Filter State Tests

- [x] **4.1** **[TDD: RED]** Create `src/js/state/filter-state.test.js`
  - Test toggle functionality
  - Test isActive functionality  
  - Test serialise functionality
  - Test apply filtering logic
  - Test edge cases (empty, invalid)

- [x] **4.2** Run tests, verify coverage — *24 tests passing*
  ```bash
  npm test -- filter-state
  ```

- [x] **4.3** **[TDD: REFACTOR]** Improve filter-state.js if needed — *code already clean*

### UI Component Tests

- [x] **4.4** **[TDD: RED]** Create `src/js/components/ui.test.js`
  - Test createButton functionality
  - Test createBadge functionality
  - Test color config mapping
  - Test sanitization of badge text

- [x] **4.5** Run tests, verify they pass — *25 tests passing*

- [x] **4.6** **[TDD: REFACTOR]** Update ui.js to use sanitization — *uses textContent already*

### Project Service Tests

- [x] **4.7** **[TDD: RED]** Create `src/js/services/project-service.test.js`
  - Test fetchAll returns projects
  - Test data structure validation

- [x] **4.8** Run tests, verify they pass — *10 tests passing*

---

## Phase 5: View Layer Tests ✅

> Reference: [02_BDD_FEATURES.md](./02_BDD_FEATURES.md)

### Filter View Tests

- [x] **5.1** **[TDD: RED]** Create `src/js/views/filter-view.test.js`
  - Test render creates badges
  - Test click toggles filter
  - Test ARIA attributes

- [x] **5.2** Run tests, verify they pass — *16 tests passing*

### Results View Tests

- [x] **5.3** **[TDD: RED]** Create `src/js/views/results-view.test.js`
  - Test project cards render
  - Test pagination works
  - Test empty state displays
  - Test XSS prevention in rendering

- [x] **5.4** Run tests, verify they pass — *22 tests passing*

- [ ] **5.5** **[TDD: REFACTOR]** Update results-view.js to use escapeHtml — *future enhancement*

---

## Phase 6: Contact Form Security 🔴

> Reference: [02_BDD_FEATURES.md](./02_BDD_FEATURES.md) Feature F03

### Client-Side Validation

- [ ] **6.1** **[TDD: RED]** Create `src/js/modules/contact-form.test.js`
  - Test validation rules
  - Test sanitization
  - Test form state management
  - Test XSS prevention

- [ ] **6.2** Run tests, verify they pass

- [ ] **6.3** **[TDD: REFACTOR]** Update contact-form.js
  - Add input validation
  - Add sanitization
  - Improve error handling

### Server-Side Validation (Optional)

- [ ] **6.4** Create `functions/api/contact.js` if implementing real form
- [ ] **6.5** Create `functions/api/contact.test.js`
- [ ] **6.6** Implement server-side validation

---

## Phase 7: Integration Tests 🟡

> Reference: [02_BDD_FEATURES.md](./02_BDD_FEATURES.md)

- [ ] **7.1** Create `__tests__/integration/projects-filter.test.js`
  - Test full filtering workflow
  - Test filter persistence

- [ ] **7.2** Create `__tests__/integration/contact-form.test.js`
  - Test form submission workflow

- [ ] **7.3** Create `__tests__/integration/theme-toggle.test.js`
  - Test theme switching
  - Test localStorage persistence

- [ ] **7.4** Create `__tests__/integration/image-search.test.js`
  - Test search workflow
  - Test error handling

- [ ] **7.5** Run all integration tests
  ```bash
  npm run test:integration
  ```

---

## Phase 8: Security Tests 🔴

- [ ] **8.1** Create `__tests__/security/xss-prevention.test.js`
  - Test all XSS vectors on form inputs
  - Test all XSS vectors on search inputs
  - Test rendering escapes HTML

- [ ] **8.2** Create `__tests__/security/api-security.test.js`
  - Test API key not exposed
  - Test rate limiting
  - Test input validation

- [ ] **8.3** Run security test suite
  ```bash
  npm run test:security
  ```

---

## Phase 9: Dependency Management 🟠

> Reference: [03_SECURITY_HARDENING.md](./03_SECURITY_HARDENING.md) Section 5

### Audit & Cleanup

- [ ] **9.1** Run npm audit
  ```bash
  npm audit
  ```

- [ ] **9.2** Fix vulnerabilities
  ```bash
  npm audit fix
  ```

- [ ] **9.3** Remove unused dependencies (reference: `.agent/dependency-cleanup.md`)
  ```bash
  npm uninstall autoprefixer nodemon concurrently
  ```

- [ ] **9.4** Move @tailwindcss/cli to devDependencies

- [ ] **9.5** Verify build still works
  ```bash
  npm run build
  ```

### Automation

- [ ] **9.6** Create `.github/workflows/security.yml`

- [ ] **9.7** Create `.github/dependabot.yml`

- [ ] **9.8** Push and verify GitHub Actions run

---

## Phase 10: Documentation & Finalization 🟢

### Update Documentation

- [ ] **10.1** Update `README.md` with testing instructions

- [ ] **10.2** Add inline documentation to new utilities

- [ ] **10.3** Update agents.md with final configuration

### Code Coverage Review

- [ ] **10.4** Run coverage report
  ```bash
  npm run test:coverage
  ```

- [ ] **10.5** Verify coverage thresholds met (60% minimum)

- [ ] **10.6** Document any coverage gaps and rationale

### Final Verification

- [ ] **10.7** Run full test suite
  ```bash
  npm test
  ```

- [ ] **10.8** Run local dev server and manual smoke test
  ```bash
  npm run dev
  ```

- [ ] **10.9** Verify all pages load without console errors

- [ ] **10.10** Verify security headers in production deployment

- [ ] **10.11** Check browser DevTools for CSP violations

### Merge & Deploy

- [ ] **10.12** Create pull request from `feature/tdd-security-upgrade`

- [ ] **10.13** Review PR, ensure all checks pass

- [ ] **10.14** Merge to main

- [ ] **10.15** Verify Cloudflare Pages deployment succeeds

- [ ] **10.16** Run post-deployment verification

---

## Quick Reference Commands

```bash
# Testing
npm test                          # Run all tests
npm run test:watch                # Watch mode
npm run test:coverage             # With coverage
npm test -- <pattern>             # Run specific tests

# Development
npm run dev                       # Start dev server
npm run build                     # Production build

# Security
npm audit                         # Check vulnerabilities
npm audit fix                     # Auto-fix vulns

# Git
git checkout -b feature/step-X    # Create feature branch
git add -A && git commit -m "..."  # Commit changes
```

---

## Success Criteria

| Metric | Target | Actual |
|--------|--------|--------|
| Unit Test Coverage | ≥60% | ____% |
| Security Tests Pass | 100% | ____% |
| npm audit (high+) | 0 vulnerabilities | ____ |
| CSP Active | Yes | [ ] |
| All Pages Load | No errors | [ ] |

---

## Troubleshooting

### Tests fail with "Cannot find module"
- Check `moduleNameMapper` in jest.config.js
- Verify file paths are correct

### JSDOM not working
- Ensure `jest-environment-jsdom` is installed
- Check `testEnvironment: "jsdom"` in config

### Coverage not meeting threshold
- Check `collectCoverageFrom` includes correct paths
- Review uncovered lines in coverage/lcov-report/index.html

### Build fails after changes
- Run `npm run build` to check errors
- Verify all imports resolve correctly

---

## Completion Sign-Off

**Phase Completion:**

| Phase | Completed | Date | Verified By |
|-------|-----------|------|-------------|
| Phase 0: Prerequisites | [x] | 2026-01-01 | AI + User |
| Phase 1: Test Infrastructure | [x] | 2026-01-01 | AI + User |
| Phase 2: Security Foundation | [ ] | | |
| Phase 3: API Security | [ ] | | |
| Phase 4: Core Unit Tests | [x] | 2026-01-01 | AI + User |
| Phase 5: View Layer Tests | [x] | 2026-01-01 | AI + User |
| Phase 6: Contact Form Security | [ ] | | |
| Phase 7: Integration Tests | [ ] | | |
| Phase 8: Security Tests | [ ] | | |
| Phase 9: Dependency Management | [ ] | | |
| Phase 10: Documentation | [ ] | | |

**Final Sign-Off:**

- [ ] All tests passing
- [ ] Security audit complete
- [ ] Documentation updated
- [ ] Production deployment verified

**Completed By:** _______________  
**Date:** _______________
