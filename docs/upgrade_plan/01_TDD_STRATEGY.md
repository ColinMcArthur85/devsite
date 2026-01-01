# TDD Strategy for devsite

**Document Version:** 1.0  
**Last Updated:** 2025-12-31  
**Status:** Planning Phase

---

## 1. Current State Audit

### 1.1 Jest Configuration Analysis

**File:** `jest.config.js`

```javascript
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  verbose: true,
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json"],
};
```

#### Issues Identified

| Issue | Severity | Description |
|-------|----------|-------------|
| No coverage reporting | Medium | No `collectCoverage` or coverage thresholds defined |
| Missing test patterns | Low | No explicit `testMatch` or `testPathIgnorePatterns` |
| Node environment only | Medium | DOM-dependent code cannot be tested without `jsdom` |
| No module aliases | Low | Path imports may become unwieldy |
| Missing setup files | Medium | No global mocks or test utilities configured |

#### Existing Tests

| File | Purpose | Coverage |
|------|---------|----------|
| `__tests__/hello.test.js` | Sanity check (2+2=4) | None (placeholder) |
| `functions/api/unsplash.test.js` | Env variable check | Minimal |

### 1.2 Babel Configuration

**File:** `babel.config.js`

```javascript
module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "18" } }]],
};
```

**Assessment:** Basic but functional. Supports ES6+ syntax transformation for Jest.

---

## 2. Target State Configuration

### 2.1 Enhanced Jest Configuration

Replace `jest.config.js` with:

```javascript
module.exports = {
  // Environment
  testEnvironment: "jsdom", // Enable DOM testing
  
  // Test discovery
  roots: ["<rootDir>/src", "<rootDir>/functions", "<rootDir>/__tests__"],
  testMatch: [
    "**/__tests__/**/*.test.js",
    "**/*.test.js",
    "**/*.spec.js"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/public/"
  ],
  
  // Transform
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  
  // Module resolution
  moduleFileExtensions: ["js", "jsx", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/js/components/$1",
    "^@services/(.*)$": "<rootDir>/src/js/services/$1",
    "^@utils/(.*)$": "<rootDir>/src/js/utils/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\?raw$": "<rootDir>/__mocks__/rawFileMock.js"
  },
  
  // Setup
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  
  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "src/js/**/*.js",
    "functions/**/*.js",
    "!**/*.test.js",
    "!**/node_modules/**"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  
  // Performance
  verbose: true,
  maxWorkers: "50%",
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true
};
```

### 2.2 Jest Setup File

Create `jest.setup.js`:

```javascript
/**
 * Jest Global Setup
 * Runs before each test file
 */

// Mock console methods to reduce noise (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   warn: jest.fn(),
// };

// Mock localStorage for browser tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Custom matchers (extend as needed)
expect.extend({
  toBeValidHtmlString(received) {
    const pass = typeof received === 'string' && 
                 received.trim().length > 0 &&
                 !received.includes('undefined');
    return {
      pass,
      message: () => `expected ${received} to be valid HTML string`,
    };
  },
});
```

### 2.3 Mock Files

Create `__mocks__/rawFileMock.js`:

```javascript
// Mock for Vite's ?raw imports
module.exports = '<div>Mocked HTML content</div>';
```

---

## 3. Test Directory Structure

```
devsite/
├── __tests__/                    # Integration & E2E tests
│   ├── integration/
│   │   ├── projects-filter.test.js
│   │   └── contact-form.test.js
│   └── e2e/
│       └── user-flows.test.js
├── src/
│   └── js/
│       ├── components/
│       │   ├── ui.js
│       │   └── ui.test.js        # Co-located unit test
│       ├── services/
│       │   ├── project-service.js
│       │   └── project-service.test.js
│       ├── state/
│       │   ├── filter-state.js
│       │   └── filter-state.test.js
│       └── utils/
│           ├── sanitize.js       # NEW: Security utility
│           └── sanitize.test.js
├── functions/
│   └── api/
│       ├── unsplash.js
│       └── unsplash.test.js
├── jest.config.js
├── jest.setup.js
└── __mocks__/
    └── rawFileMock.js
```

---

## 4. Test Templates

### 4.1 Unit Test Template

```javascript
/**
 * @file component-name.test.js
 * @description Unit tests for ComponentName
 * 
 * TDD Cycle: RED → GREEN → REFACTOR
 */

import { functionUnderTest } from './component-name.js';

describe('ComponentName', () => {
  // Setup & Teardown
  let mockDependency;

  beforeEach(() => {
    mockDependency = jest.fn();
    // Reset DOM if needed
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Group by feature/behavior
  describe('featureName', () => {
    
    // Happy path
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = { /* test data */ };
      const expected = { /* expected result */ };

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toEqual(expected);
    });

    // Edge cases
    it('should handle empty input gracefully', () => {
      expect(() => functionUnderTest(null)).not.toThrow();
    });

    // Error cases
    it('should throw [ErrorType] when [invalid condition]', () => {
      expect(() => functionUnderTest(invalidInput))
        .toThrow(ExpectedError);
    });
  });

  // Security tests (mandatory for input handling)
  describe('security', () => {
    it('should sanitize HTML in user input', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const result = functionUnderTest(maliciousInput);
      expect(result).not.toContain('<script>');
    });
  });
});
```

### 4.2 Integration Test Template

```javascript
/**
 * @file feature-name.integration.test.js
 * @description Integration tests for FeatureName
 * 
 * Tests multiple units working together
 */

import { setupTestEnvironment, teardownTestEnvironment } from '../test-utils.js';

describe('Feature: [Feature Name]', () => {
  
  beforeAll(() => {
    setupTestEnvironment();
  });

  afterAll(() => {
    teardownTestEnvironment();
  });

  describe('Scenario: [Scenario Description]', () => {
    
    it('Given [precondition], When [action], Then [expected result]', async () => {
      // Given
      const initialState = await setupScenario();
      
      // When
      const result = await performAction(initialState);
      
      // Then
      expect(result.status).toBe('success');
      expect(result.data).toMatchSnapshot();
    });
  });
});
```

### 4.3 API Function Test Template

```javascript
/**
 * @file api-function.test.js
 * @description Tests for Cloudflare Worker function
 */

// Mock fetch for API calls
global.fetch = jest.fn();

describe('API: /api/endpoint', () => {
  const mockEnv = {
    API_KEY: 'test-key-123',
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  describe('GET requests', () => {
    it('should return 400 when query parameter is missing', async () => {
      const request = new Request('https://example.com/api/endpoint');
      const context = { request, env: mockEnv };

      const response = await onRequest(context);
      
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBeDefined();
    });

    it('should return data when valid query is provided', async () => {
      const mockData = { results: [] };
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const request = new Request('https://example.com/api/endpoint?query=test');
      const context = { request, env: mockEnv };

      const response = await onRequest(context);
      
      expect(response.status).toBe(200);
    });
  });

  describe('Security', () => {
    it('should not expose API key in response', async () => {
      // ... test implementation
    });

    it('should sanitize query parameters', async () => {
      const maliciousQuery = '<script>alert(1)</script>';
      const request = new Request(`https://example.com/api/endpoint?query=${encodeURIComponent(maliciousQuery)}`);
      // ... verify sanitization
    });
  });
});
```

---

## 5. Coverage Goals Roadmap

### Phase 1: Foundation (Week 1-2)
| Target | Current | Goal | Priority |
|--------|---------|------|----------|
| `filter-state.js` | 0% | 90% | High |
| `project-service.js` | 0% | 80% | High |
| `unsplash.js` | ~5% | 80% | High |

### Phase 2: Components (Week 3-4)
| Target | Current | Goal | Priority |
|--------|---------|------|----------|
| `ui.js` | 0% | 70% | Medium |
| `filter-view.js` | 0% | 70% | Medium |
| `results-view.js` | 0% | 60% | Medium |

### Phase 3: Integration (Week 5-6)
| Target | Current | Goal | Priority |
|--------|---------|------|----------|
| Project filtering flow | 0% | 80% | Medium |
| Contact form submission | 0% | 70% | Medium |
| Image search flow | 0% | 70% | Medium |

### Phase 4: Security & Edge Cases (Ongoing)
| Target | Current | Goal | Priority |
|--------|---------|------|----------|
| XSS prevention | 0% | 100% | Critical |
| Input validation | 0% | 100% | Critical |
| Error handling | 0% | 80% | High |

---

## 6. NPM Scripts

Update `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --reporters=default --reporters=jest-junit",
    "test:unit": "jest --testPathPattern='src/.*\\.test\\.js$'",
    "test:integration": "jest --testPathPattern='__tests__/integration'",
    "test:security": "jest --testPathPattern='security\\.test\\.js$'"
  }
}
```

---

## 7. TDD Workflow Checklist

For each new feature or bug fix:

- [ ] **1. Write the failing test first** (RED)
  - Define expected behavior
  - Run `npm test` — confirm test fails

- [ ] **2. Write minimal implementation** (GREEN)
  - Only enough code to pass
  - Run `npm test` — confirm test passes

- [ ] **3. Refactor** (REFACTOR)
  - Improve code quality
  - Run `npm test` — confirm tests still pass

- [ ] **4. Add edge cases**
  - Empty input
  - Invalid types
  - Boundary values

- [ ] **5. Add security tests**
  - XSS vectors
  - Injection attempts

- [ ] **6. Run coverage report**
  - `npm run test:coverage`
  - Ensure thresholds met

---

## 8. Required Dependencies

```bash
# Already installed
npm install --save-dev jest babel-jest @babel/core @babel/preset-env

# To be installed
npm install --save-dev jest-environment-jsdom identity-obj-proxy jest-junit
```

---

## Next Steps

1. → Proceed to `02_BDD_FEATURES.md` for feature specifications
2. → Implement Jest configuration changes
3. → Create first unit tests for `filter-state.js` (highest priority)
