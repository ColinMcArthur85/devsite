/**
 * Jest Setup File
 *
 * This file runs before each test file and sets up global mocks
 * for browser APIs that aren't available in jsdom.
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
Object.defineProperty(window, "sessionStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
}
Object.defineProperty(window, "IntersectionObserver", {
  value: IntersectionObserverMock,
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
}
Object.defineProperty(window, "ResizeObserver", {
  value: ResizeObserverMock,
  writable: true,
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock fetch (basic implementation)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
  }),
);

// Clear all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});

// Console error suppression for expected errors (optional)
// Uncomment if you want to suppress specific console errors in tests
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     if (args[0].includes('Expected error message')) return;
//     originalError.call(console, ...args);
//   };
// });
// afterAll(() => {
//   console.error = originalError;
// });
