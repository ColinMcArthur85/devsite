module.exports = {
  // Use jsdom for DOM testing (browser-like environment)
  testEnvironment: "jsdom",

  // Look for tests in these directories
  roots: ["<rootDir>/__tests__", "<rootDir>/src", "<rootDir>/functions"],

  // Test file patterns
  testMatch: ["**/__tests__/**/*.test.js", "**/*.test.js"],

  // Verbose output for clarity
  verbose: true,

  // Transform JS/JSX files with babel
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  // Supported file extensions
  moduleFileExtensions: ["js", "jsx", "json"],

  // Module name mapping for imports
  moduleNameMapper: {
    // Handle CSS imports (return empty object)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Handle image imports
    "\\.(jpg|jpeg|png|gif|svg|webp)$": "<rootDir>/__mocks__/fileMock.js",
    // Path aliases (match your project structure)
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Setup file for global mocks
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Coverage configuration
  collectCoverageFrom: ["src/**/*.js", "functions/**/*.js", "!src/**/*.min.js", "!**/node_modules/**"],

  // Coverage thresholds (start at 60%, increase over time)
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Coverage reporters
  coverageReporters: ["text", "lcov", "html"],

  // JUnit reporter for CI
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "coverage",
        outputName: "junit.xml",
      },
    ],
  ],
};
