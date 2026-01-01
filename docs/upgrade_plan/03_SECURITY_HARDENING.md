# Security Hardening Plan for devsite

**Document Version:** 1.0  
**Last Updated:** 2025-12-31  
**Status:** Planning Phase  
**Classification:** DevSecOps

---

## 1. Executive Summary

This document outlines a comprehensive security hardening strategy for the devsite portfolio, implementing OWASP best practices for static sites with serverless functions.

### Threat Model Overview

| Threat | Risk Level | Mitigation |
|--------|------------|------------|
| XSS (Cross-Site Scripting) | High | CSP, Input Sanitization |
| Dependency Vulnerabilities | Medium | npm audit, Dependabot |
| API Key Exposure | High | Server-side proxy, env vars |
| Clickjacking | Low | X-Frame-Options |
| Data Injection | Medium | Input validation |
| CSRF | Low | SameSite cookies (if needed) |

---

## 2. HTTP Security Headers

### 2.1 Cloudflare Pages Headers Configuration

Create `/public/_headers`:

```
# Security Headers for all routes
/*
  # Prevent clickjacking attacks
  X-Frame-Options: DENY
  
  # Prevent MIME type sniffing
  X-Content-Type-Options: nosniff
  
  # Enable XSS protection (legacy browsers)
  X-XSS-Protection: 1; mode=block
  
  # Control referrer information
  Referrer-Policy: strict-origin-when-cross-origin
  
  # Disable browser feature permissions
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  
  # Content Security Policy (see detailed breakdown below)
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https://api.unsplash.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'

# API routes - more restrictive
/api/*
  X-Content-Type-Options: nosniff
  Content-Type: application/json
  Cache-Control: no-store, no-cache, must-revalidate

# Static assets - allow caching
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### 2.2 Content Security Policy Breakdown

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Only allow resources from same origin by default |
| `script-src` | `'self' 'unsafe-inline'` | Allow inline scripts (needed for Vite/dynamic rendering) |
| `style-src` | `'self' 'unsafe-inline' https://fonts.googleapis.com` | Allow Google Fonts CSS |
| `font-src` | `'self' https://fonts.gstatic.com` | Allow Google Fonts files |
| `img-src` | `'self' https: data:` | Allow all HTTPS images and data URIs |
| `connect-src` | `'self' https://api.unsplash.com` | Control fetch/XHR destinations |
| `frame-ancestors` | `'none'` | Prevent embedding in iframes |
| `base-uri` | `'self'` | Prevent base tag injection |
| `form-action` | `'self'` | Restrict form submission targets |

### 2.3 CSP Roadmap (Progressive Hardening)

#### Phase 1: Report Only Mode
```
Content-Security-Policy-Report-Only: [policy]; report-uri /csp-report
```

#### Phase 2: Remove unsafe-inline (Target)
- Migrate inline scripts to external files
- Use nonce-based CSP for dynamic scripts
- Generate nonces server-side

#### Phase 3: Strict CSP
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'nonce-{random}'; ...
```

---

## 3. Form Security (Contact Form)

### 3.1 Client-Side Validation

**File:** `src/js/modules/contact-form.js`

```javascript
// Input validation schema
const ValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-'\.]+$/,
    sanitize: true
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    sanitize: true
  }
};

// Validation function
function validateField(name, value) {
  const rules = ValidationRules[name];
  if (!rules) return { valid: false, error: 'Unknown field' };
  
  if (rules.required && !value?.trim()) {
    return { valid: false, error: 'This field is required' };
  }
  
  if (rules.minLength && value.length < rules.minLength) {
    return { valid: false, error: `Minimum ${rules.minLength} characters` };
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    return { valid: false, error: `Maximum ${rules.maxLength} characters` };
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    return { valid: false, error: 'Invalid format' };
  }
  
  return { valid: true };
}
```

### 3.2 Input Sanitization Utility

Create **`src/js/utils/sanitize.js`**:

```javascript
/**
 * @file sanitize.js
 * @description Security utilities for input sanitization
 * 
 * OWASP Recommendations:
 * - Encode output, not input (context-specific)
 * - Use allowlists, not denylists
 * - Validate input server-side as well
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - Input string
 * @returns {string} - Escaped string safe for HTML insertion
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return str.replace(/[&<>"'`=\/]/g, char => escapeMap[char]);
}

/**
 * Strips HTML tags from string
 * @param {string} str - Input string
 * @returns {string} - String with HTML tags removed
 */
export function stripTags(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes string for safe URL query parameter
 * @param {string} str - Input string
 * @returns {string} - URL-safe string
 */
export function sanitizeForUrl(str) {
  if (typeof str !== 'string') return '';
  // Remove control characters and trim
  return str
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, 200); // Limit length
}

/**
 * Validates and sanitizes for safe DOM text content
 * @param {string} str - Input string
 * @returns {string} - Safe string for textContent
 */
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  // textContent is safe, but we still remove control chars
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/**
 * Creates safe HTML from template using textContent (not innerHTML)
 * @param {string} template - HTML template with placeholders
 * @param {Object} data - Data object with values
 * @returns {DocumentFragment} - Safe DOM fragment
 */
export function createSafeHtml(template, data) {
  const fragment = document.createRange().createContextualFragment(template);
  
  Object.entries(data).forEach(([key, value]) => {
    const element = fragment.querySelector(`[data-bind="${key}"]`);
    if (element) {
      element.textContent = sanitizeText(value);
    }
  });
  
  return fragment;
}
```

### 3.3 Test File for Sanitization

Create **`src/js/utils/sanitize.test.js`**:

```javascript
import { escapeHtml, stripTags, sanitizeForUrl, sanitizeText } from './sanitize.js';

describe('Sanitization Utilities', () => {
  
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should handle ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should handle empty string', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle non-string input', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(123)).toBe('');
    });

    it('should escape all XSS vectors', () => {
      const vectors = [
        '<img src=x onerror=alert(1)>',
        '"><script>alert(1)</script>',
        "javascript:alert('XSS')",
        '<svg onload=alert(1)>',
        '{{constructor.constructor("alert(1)")()}}'
      ];
      
      vectors.forEach(vector => {
        const result = escapeHtml(vector);
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('<img');
        expect(result).not.toContain('<svg');
      });
    });
  });

  describe('stripTags', () => {
    it('should remove HTML tags', () => {
      expect(stripTags('<p>Hello <strong>World</strong></p>'))
        .toBe('Hello World');
    });

    it('should handle malformed HTML', () => {
      expect(stripTags('<div>Unclosed')).toBe('Unclosed');
    });
  });

  describe('sanitizeForUrl', () => {
    it('should remove control characters', () => {
      expect(sanitizeForUrl('test\x00\x1F')).toBe('test');
    });

    it('should limit length to 200 characters', () => {
      const longString = 'a'.repeat(300);
      expect(sanitizeForUrl(longString).length).toBe(200);
    });

    it('should trim whitespace', () => {
      expect(sanitizeForUrl('  test  ')).toBe('test');
    });
  });
});
```

### 3.4 Server-Side Validation (Cloudflare Function)

If implementing real form submission, create **`functions/api/contact.js`**:

```javascript
/**
 * Contact Form API Endpoint
 * Implements server-side validation for form submissions
 */

const VALIDATION_RULES = {
  name: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, maxLength: 254 },
  message: { required: true, minLength: 10, maxLength: 2000 }
};

function validateInput(data) {
  const errors = {};
  
  for (const [field, rules] of Object.entries(VALIDATION_RULES)) {
    const value = data[field]?.trim() || '';
    
    if (rules.required && !value) {
      errors[field] = 'Required';
      continue;
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `Minimum ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `Maximum ${rules.maxLength} characters`;
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = 'Invalid format';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

function sanitize(str) {
  return String(str)
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
}

export async function onRequest(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || 'https://your-domain.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const body = await request.json();
    
    // Sanitize all inputs
    const sanitizedData = {
      name: sanitize(body.name),
      email: sanitize(body.email),
      message: sanitize(body.message)
    };
    
    // Validate
    const validation = validateInput(sanitizedData);
    if (!validation.valid) {
      return new Response(JSON.stringify({ 
        error: 'Validation failed', 
        details: validation.errors 
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    // TODO: Send email or store submission
    // await sendEmail(sanitizedData, env);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: corsHeaders
    });
  }
}
```

---

## 4. API Security (Unsplash Integration)

### 4.1 Current Issues

**File:** `functions/api/unsplash.js`

| Issue | Severity | Fix |
|-------|----------|-----|
| CORS allows only localhost | High | Make configurable via env |
| No input validation | Medium | Validate/sanitize query params |
| No rate limiting | Medium | Add request throttling |
| Error exposes internal details | Low | Sanitize error messages |

### 4.2 Hardened API Implementation

Replace `functions/api/unsplash.js`:

```javascript
/**
 * Unsplash API Proxy
 * Securely proxies requests to Unsplash API
 * 
 * Security Measures:
 * - API key hidden from client
 * - Input validation/sanitization
 * - Rate limiting
 * - Error message sanitization
 */

// Rate limiting (simple in-memory, resets on worker restart)
const rateLimitMap = new Map();
const RATE_LIMIT = 30; // requests per minute per IP
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now - record.timestamp > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// Input sanitization
function sanitizeQuery(query) {
  if (typeof query !== 'string') return null;
  return query
    .replace(/[<>"'`=]/g, '') // Remove potential XSS characters
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .slice(0, 100); // Limit length
}

function sanitizeNumber(value, defaultVal, min, max) {
  const num = parseInt(value, 10);
  if (isNaN(num)) return defaultVal;
  return Math.min(Math.max(num, min), max);
}

// Allowed values for enum parameters
const ALLOWED_ORIENTATIONS = ['landscape', 'portrait', 'squarish'];
const ALLOWED_ORDER_BY = ['relevant', 'latest'];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Get client IP for rate limiting
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // CORS configuration - use env variable in production
  const allowedOrigin = env.ALLOWED_ORIGIN || 
    (env.ENVIRONMENT === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:5173');

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff'
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow GET
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  // Rate limiting check
  if (!checkRateLimit(clientIP)) {
    return new Response(JSON.stringify({ 
      error: 'Rate limit exceeded. Please try again later.' 
    }), {
      status: 429,
      headers: {
        ...corsHeaders,
        'Retry-After': '60'
      }
    });
  }

  // Validate and sanitize query parameter
  const rawQuery = url.searchParams.get("query");
  const query = sanitizeQuery(rawQuery);
  
  if (!query || query.length < 1) {
    return new Response(JSON.stringify({ 
      error: 'Valid search query is required' 
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Sanitize and validate other parameters
  const page = sanitizeNumber(url.searchParams.get("page"), 1, 1, 100);
  const perPage = sanitizeNumber(url.searchParams.get("per_page"), 12, 1, 30);
  
  const orientation = url.searchParams.get("orientation");
  const safeOrientation = ALLOWED_ORIENTATIONS.includes(orientation) ? orientation : null;
  
  const orderBy = url.searchParams.get("order_by");
  const safeOrderBy = ALLOWED_ORDER_BY.includes(orderBy) ? orderBy : 'relevant';

  // Build Unsplash API URL
  const unsplashUrl = new URL("https://api.unsplash.com/search/photos");
  unsplashUrl.searchParams.set("query", query);
  unsplashUrl.searchParams.set("page", page.toString());
  unsplashUrl.searchParams.set("per_page", perPage.toString());
  unsplashUrl.searchParams.set("order_by", safeOrderBy);
  if (safeOrientation) {
    unsplashUrl.searchParams.set("orientation", safeOrientation);
  }

  try {
    // Verify API key exists
    if (!env.UNSPLASH_ACCESS_KEY) {
      console.error('UNSPLASH_ACCESS_KEY not configured');
      return new Response(JSON.stringify({ 
        error: 'Service temporarily unavailable' 
      }), {
        status: 503,
        headers: corsHeaders
      });
    }

    const response = await fetch(unsplashUrl.toString(), {
      headers: {
        Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    });

    // Handle upstream errors
    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status}`);
      
      // Don't expose internal error details
      const errorMessage = response.status === 403 
        ? 'API rate limit reached'
        : 'Search service temporarily unavailable';
        
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status === 403 ? 429 : 503,
        headers: corsHeaders
      });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (err) {
    console.error('Unsplash proxy error:', err.message);
    
    // Never expose internal error details to client
    return new Response(JSON.stringify({ 
      error: 'An error occurred processing your request' 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
```

### 4.3 API Security Test

Enhance **`functions/api/unsplash.test.js`**:

```javascript
/**
 * @file unsplash.test.js
 * @description Security and functionality tests for Unsplash API proxy
 */

// Mock fetch
global.fetch = jest.fn();

// Import the function (adjust path as needed)
// Note: Need to structure for testability

describe('Unsplash API Proxy', () => {
  const mockEnv = {
    UNSPLASH_ACCESS_KEY: 'test-key-123',
    ALLOWED_ORIGIN: 'http://localhost:5173',
    ENVIRONMENT: 'development'
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Input Validation', () => {
    it('should reject empty query', async () => {
      const request = new Request('http://localhost/api/unsplash');
      const context = { 
        request, 
        env: mockEnv 
      };
      
      // Test implementation would go here
      // For now, this documents expected behavior
    });

    it('should sanitize XSS in query parameter', async () => {
      const maliciousQuery = '<script>alert(1)</script>';
      const request = new Request(
        `http://localhost/api/unsplash?query=${encodeURIComponent(maliciousQuery)}`
      );
      
      // Verify query is sanitized before sending to Unsplash
    });

    it('should limit query length to 100 characters', async () => {
      const longQuery = 'a'.repeat(200);
      // Verify truncation
    });

    it('should validate page parameter bounds', async () => {
      // page should be 1-100
    });

    it('should validate per_page parameter bounds', async () => {
      // per_page should be 1-30
    });

    it('should reject invalid orientation values', async () => {
      // Only allow: landscape, portrait, squarish
    });
  });

  describe('Security Headers', () => {
    it('should include CORS headers in response', async () => {
      // Verify Access-Control-* headers
    });

    it('should include X-Content-Type-Options header', async () => {
      // Verify nosniff header
    });
  });

  describe('Error Handling', () => {
    it('should not expose internal errors to client', async () => {
      fetch.mockRejectedValueOnce(new Error('Database connection failed'));
      
      // Verify generic error message returned
    });

    it('should not expose API key in errors', async () => {
      // Verify API key not in response body
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 after exceeding rate limit', async () => {
      // Make 31 requests from same IP
      // Verify 429 response
    });

    it('should include Retry-After header on rate limit', async () => {
      // Verify header present
    });
  });
});
```

---

## 5. Dependency Audit Strategy

### 5.1 NPM Audit Workflow

Add to `package.json`:

```json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "audit:ci": "npm audit --audit-level=high",
    "preinstall": "npm audit --audit-level=critical"
  }
}
```

### 5.2 GitHub Actions Workflow

Create `.github/workflows/security.yml`:

```yaml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    # Run weekly on Mondays at 9am UTC
    - cron: '0 9 * * 1'

jobs:
  audit:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true

      - name: Run npm audit (JSON output)
        run: npm audit --json > audit-results.json
        continue-on-error: true

      - name: Upload audit results
        uses: actions/upload-artifact@v4
        with:
          name: npm-audit-results
          path: audit-results.json
          retention-days: 30

  dependency-review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Dependency Review
        uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: high
          deny-licenses: GPL-3.0, AGPL-3.0
```

### 5.3 Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2

updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "America/Vancouver"
    open-pull-requests-limit: 10
    groups:
      development-dependencies:
        dependency-type: "development"
        update-types:
          - "minor"
          - "patch"
      production-dependencies:
        dependency-type: "production"
        update-types:
          - "minor"
          - "patch"
    commit-message:
      prefix: "chore(deps)"
    labels:
      - "dependencies"
      - "security"
```

---

## 6. DOM Security Guidelines

### 6.1 innerHTML Usage Audit

Files requiring review:

| File | Usage | Risk | Mitigation |
|------|-------|------|------------|
| `results-view.js` | Project card rendering | High | Use escapeHtml for data |
| `header.js` | Menu template injection | Medium | Template is trusted |
| `features-renderer.js` | Feature cards | Medium | Data from trusted source |
| `skills-renderer.js` | Skill cards | Medium | Data from trusted source |

### 6.2 Safe Rendering Pattern

```javascript
// BEFORE (vulnerable)
container.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;

// AFTER (safe)
import { escapeHtml } from '../utils/sanitize.js';

container.innerHTML = `
  <h3>${escapeHtml(project.title)}</h3>
  <p>${escapeHtml(project.description)}</p>
`;

// BEST (using DOM methods)
const h3 = document.createElement('h3');
h3.textContent = project.title; // textContent is safe

const p = document.createElement('p');
p.textContent = project.description;

container.appendChild(h3);
container.appendChild(p);
```

---

## 7. Environment Variables Security

### 7.1 Required Configuration

| Variable | Purpose | Location |
|----------|---------|----------|
| `UNSPLASH_ACCESS_KEY` | Unsplash API auth | `.dev.vars` (local), Cloudflare Dashboard (prod) |
| `ALLOWED_ORIGIN` | CORS whitelist | Cloudflare Dashboard |
| `ENVIRONMENT` | production/development flag | Cloudflare Dashboard |

### 7.2 Verification Checklist

- [ ] `.dev.vars` is in `.gitignore`
- [ ] No secrets hardcoded in source files
- [ ] Cloudflare env vars configured for production
- [ ] API keys rotated if ever exposed

---

## 8. Security Testing Commands

```bash
# Run security-focused tests
npm run test:security

# Check for known vulnerabilities
npm audit

# Check for secrets in code (install gitleaks first)
gitleaks detect --source . --verbose

# Check CSP effectiveness (in browser console)
# securitypolicyviolation event should fire for blocked resources

# OWASP ZAP scan (if installed)
zap-cli quick-scan https://your-site.pages.dev
```

---

## Next Steps

1. → Proceed to `04_EXECUTION_CHECKLIST.md` for step-by-step implementation
2. → Create `src/js/utils/sanitize.js` as first security module
3. → Update `functions/api/unsplash.js` with hardened version
4. → Create `public/_headers` file
