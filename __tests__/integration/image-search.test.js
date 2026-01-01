/**
 * Image Search Integration Tests
 * 
 * Tests the image search workflow by integrating:
 * - Input validation (from unsplash-helpers)
 * - API security features
 * - Error handling
 */

import {
  validateQuery,
  validatePagination,
  sanitizeErrorMessage,
  getCorsHeaders,
  isAllowedOrigin
} from '../../functions/api/unsplash-helpers.js';

describe('Image Search Integration', () => {
  describe('Search Query Workflow', () => {
    test('valid search query passes through workflow', () => {
      const userInput = 'mountain landscape';
      
      // Step 1: Validate query
      const queryResult = validateQuery(userInput);
      expect(queryResult.valid).toBe(true);
      expect(queryResult.sanitized).toBe('mountain landscape');
      
      // Step 2: Validate pagination (defaults)
      const paginationResult = validatePagination(null, null);
      expect(paginationResult.valid).toBe(true);
      expect(paginationResult.page).toBe(1);
      expect(paginationResult.perPage).toBe(12);
    });

    test('malicious query is sanitized', () => {
      const maliciousInput = '<script>alert("xss")</script>cats';
      
      const queryResult = validateQuery(maliciousInput);
      
      expect(queryResult.valid).toBe(true);
      expect(queryResult.sanitized).toBe('cats');
      expect(queryResult.sanitized).not.toContain('<script>');
    });

    test('empty query is rejected', () => {
      const emptyInput = '';
      
      const queryResult = validateQuery(emptyInput);
      
      expect(queryResult.valid).toBe(false);
      expect(queryResult.error).toBe('Query is required');
    });

    test('too long query is rejected', () => {
      const longQuery = 'a'.repeat(201);
      
      const queryResult = validateQuery(longQuery);
      
      expect(queryResult.valid).toBe(false);
      expect(queryResult.error).toContain('too long');
    });
  });

  describe('Pagination Workflow', () => {
    test('custom pagination is validated', () => {
      const result = validatePagination('3', '24');
      
      expect(result.valid).toBe(true);
      expect(result.page).toBe(3);
      expect(result.perPage).toBe(24);
    });

    test('pagination limits are enforced', () => {
      // Page > 100 is capped
      const pageResult = validatePagination('500', '12');
      expect(pageResult.page).toBe(100);
      
      // perPage > 30 is capped
      const perPageResult = validatePagination('1', '100');
      expect(perPageResult.perPage).toBe(30);
    });

    test('invalid page is rejected', () => {
      const result = validatePagination('abc', '12');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid page');
    });

    test('negative page is rejected', () => {
      const result = validatePagination('-5', '12');
      
      expect(result.valid).toBe(false);
    });
  });

  describe('Error Handling Workflow', () => {
    test('internal errors are sanitized', () => {
      const internalError = 'Error at /home/user/project/secret.js:45:12';
      
      const safeMessage = sanitizeErrorMessage(internalError);
      
      expect(safeMessage).toBe('An error occurred processing your request');
      expect(safeMessage).not.toContain('/home/user');
    });

    test('stack traces are sanitized', () => {
      const stackTrace = `Error: Connection failed
    at Object.<anonymous> (/path/to/file.js:10:15)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)`;
      
      const safeMessage = sanitizeErrorMessage(stackTrace);
      
      expect(safeMessage).toBe('An error occurred processing your request');
    });

    test('safe validation errors pass through', () => {
      expect(sanitizeErrorMessage('Query is required')).toBe('Query is required');
      expect(sanitizeErrorMessage('Invalid page number')).toBe('Invalid page number');
    });
  });

  describe('CORS Security Workflow', () => {
    test('production origin is allowed in production', () => {
      const origin = 'https://colinmcarthur.dev';
      
      expect(isAllowedOrigin(origin, 'production')).toBe(true);
      
      const headers = getCorsHeaders(origin, 'production');
      expect(headers['Access-Control-Allow-Origin']).toBe(origin);
    });

    test('localhost is blocked in production', () => {
      const origin = 'http://localhost:5173';
      
      expect(isAllowedOrigin(origin, 'production')).toBe(false);
      
      const headers = getCorsHeaders(origin, 'production');
      expect(headers['Access-Control-Allow-Origin']).toBe('null');
    });

    test('localhost is allowed in development', () => {
      const origin = 'http://localhost:5173';
      
      expect(isAllowedOrigin(origin, 'development')).toBe(true);
      
      const headers = getCorsHeaders(origin, 'development');
      expect(headers['Access-Control-Allow-Origin']).toBe(origin);
    });

    test('malicious origin is blocked', () => {
      const origin = 'https://evil-site.com';
      
      expect(isAllowedOrigin(origin, 'production')).toBe(false);
      expect(isAllowedOrigin(origin, 'development')).toBe(false);
    });

    test('security headers are always included', () => {
      const headers = getCorsHeaders('https://colinmcarthur.dev', 'production');
      
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['X-Frame-Options']).toBe('DENY');
    });
  });

  describe('Full Search Request Simulation', () => {
    test('complete valid search request workflow', () => {
      // Simulate user input
      const userQuery = 'beautiful sunset';
      const requestedPage = '2';
      const requestedPerPage = '24';
      const origin = 'https://colinmcarthur.dev';
      const environment = 'production';
      
      // Validate query
      const queryResult = validateQuery(userQuery);
      expect(queryResult.valid).toBe(true);
      
      // Validate pagination
      const paginationResult = validatePagination(requestedPage, requestedPerPage);
      expect(paginationResult.valid).toBe(true);
      
      // Validate origin
      expect(isAllowedOrigin(origin, environment)).toBe(true);
      
      // Get response headers
      const headers = getCorsHeaders(origin, environment);
      expect(headers['Access-Control-Allow-Origin']).toBe(origin);
      
      // All validations passed - would proceed with API call
    });

    test('complete invalid search request workflow', () => {
      // Simulate malicious input
      const maliciousQuery = '<script>steal()</script>';
      const origin = 'https://evil.com';
      const environment = 'production';
      
      // Validate query - should be sanitized
      const queryResult = validateQuery(maliciousQuery);
      
      // In this case, after sanitization the query is empty
      expect(queryResult.valid).toBe(false);
      
      // Even if query was valid, origin would fail
      expect(isAllowedOrigin(origin, environment)).toBe(false);
    });
  });
});
