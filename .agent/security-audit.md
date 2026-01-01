# Security Audit & Hardening Plan

A phased approach to securing the devsite project.

---

## 📊 Current Security Assessment

### Risk Level: **Low-Medium**
- Static site with minimal server-side code
- One API endpoint (Unsplash proxy)
- No authentication or user accounts
- No database or persistent storage
- Contact form is currently fake (no actual data transmission)

---

## 🔴 Phase 1: Critical Issues (Immediate)

### 1.1 CORS Configuration Too Permissive
- [ ] **Issue**: Unsplash API endpoint allows CORS from `http://localhost:5173` only
- **File**: `functions/api/unsplash.js`
- **Risk**: Production deployment won't work properly
- **Fix**: 
  ```javascript
  // Change from:
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  
  // To:
  'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
  ```
- **Action**: Add production domain or use environment variable

### 1.2 API Key Exposure Prevention
- [ ] **Verify**: Ensure `.dev.vars` is in `.gitignore` ✓ (confirmed in .gitignore)
- [ ] **Check**: Verify no API keys are hardcoded in any JS files
- **File to check**: `functions/api/unsplash.js` - uses `env.UNSPLASH_ACCESS_KEY` ✓
- **Action**: Run `git log -p | grep -i "api\|key\|secret"` to check history

### 1.3 Input Validation in API
- [ ] **Issue**: Query parameters are passed directly to Unsplash API without validation
- **File**: `functions/api/unsplash.js`
- **Risk**: Parameter injection, potential abuse
- **Fix**:
  ```javascript
  // Add validation
  const sanitizeQuery = (q) => q?.replace(/[<>'"]/g, '').slice(0, 100);
  const query = sanitizeQuery(url.searchParams.get("query"));
  ```

---

## 🟠 Phase 2: XSS Prevention (High Priority)

### 2.1 Audit DOM Manipulation
- [ ] **Search for**: `innerHTML` usage in JavaScript files
- **Files to review**:
  - `results-view.js` - Uses innerHTML with project data
  - `filter-view.js` - Uses createBadge, appears safe
  - `header.js` - Uses innerHTML for menu injection
  - `features-renderer.js` - Uses innerHTML with features data
  - `skills-renderer.js` - Uses innerHTML with skills data

### 2.2 Sanitize User-Generated Content
- [ ] **Issue**: Project descriptions rendered via innerHTML without sanitization
- **File**: `results-view.js`
- **Fix**: Create sanitization utility:
  ```javascript
  // Add to utils or create sanitize.js
  export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  ```
- **Apply to**: `project.title`, `project.description` in results-view.js

### 2.3 Template Literal Injection
- [ ] **Review**: All template literals that include external data
- **Files**: All renderer files
- **Action**: Ensure data is escaped before interpolation

---

## 🟡 Phase 3: Security Headers (Medium Priority)

### 3.1 Add Security Headers
- [ ] **Create**: `_headers` file for Cloudflare Pages
- **Location**: `/public/_headers`
- **Content**:
  ```
  /*
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    X-XSS-Protection: 1; mode=block
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```

### 3.2 Content Security Policy
- [ ] **Add**: CSP header (start permissive, tighten over time)
- **Initial CSP**:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https://api.unsplash.com
  ```

### 3.3 Subresource Integrity
- [ ] **Add SRI**: To externally loaded resources
- **File**: `index.html` and other HTML files
- **Example**:
  ```html
  <link rel="stylesheet" 
        href="https://fonts.googleapis.com/..." 
        crossorigin="anonymous">
  ```

---

## 🟢 Phase 4: Rate Limiting & Abuse Prevention (Lower Priority)

### 4.1 API Rate Limiting
- [ ] **Issue**: Unsplash API endpoint has no rate limiting
- **Risk**: Abuse could exhaust API quota
- **Fix**: Add Cloudflare Rate Limiting or implement in-function:
  ```javascript
  // Simple in-memory rate limit (resets on function restart)
  const rateLimiter = new Map();
  const RATE_LIMIT = 30; // requests per minute
  
  export async function onRequest(context) {
    const ip = context.request.headers.get('CF-Connecting-IP');
    const now = Date.now();
    // ... rate limit logic
  }
  ```

### 4.2 Contact Form Protection
- [ ] **Add**: Rate limiting for contact form (when real backend is added)
- [ ] **Add**: Honeypot field for bot detection
- [ ] **Consider**: reCAPTCHA or hCaptcha integration

---

## 🔵 Phase 5: Monitoring & Logging (Ongoing)

### 5.1 Error Monitoring
- [ ] **Consider**: Sentry or similar for client-side error tracking
- [ ] **Implement**: Cloudflare Analytics for traffic monitoring

### 5.2 API Logging
- [ ] **Add**: Request logging in API functions
- **Note**: Cloudflare Workers has built-in logging; enable in dashboard

### 5.3 Dependency Scanning
- [ ] **Setup**: `npm audit` in CI/CD pipeline
- [ ] **Consider**: Dependabot or Renovate for automated updates

---

## 🧪 Security Testing Commands

```bash
# Check for known vulnerabilities in dependencies
npm audit

# Fix automatically where possible
npm audit fix

# Check for secrets in git history
git log -p | grep -iE "(api_key|secret|password|token)" | head -50

# Find all innerHTML usage
grep -rn "innerHTML" src/js/

# Find all eval or Function constructor usage (dangerous)
grep -rn "eval\|new Function" src/js/

# Check for hardcoded URLs/keys in source
grep -rn "http\|https\|api\.unsplash\|key=" src/js/
```

---

## 📋 Testing Checklist

After implementing security fixes:

- [ ] All pages load without console errors
- [ ] Dark mode still works
- [ ] Projects page filters work correctly
- [ ] Image search API still functions
- [ ] No visible XSS when adding special characters to search
- [ ] Security headers appear in browser DevTools (Network → Response Headers)
- [ ] `npm audit` returns 0 vulnerabilities (or only acceptable ones)

---

## 🎯 Priority Order for Implementation

| Priority | Phase | Item | Effort |
|----------|-------|------|--------|
| 1 | Phase 1 | Fix CORS for production | Low |
| 2 | Phase 1 | Verify no key exposure | Low |
| 3 | Phase 1 | Add API input validation | Low |
| 4 | Phase 2 | Audit innerHTML usage | Medium |
| 5 | Phase 2 | Add HTML sanitization | Medium |
| 6 | Phase 3 | Add security headers | Low |
| 7 | Phase 3 | Add CSP header | Medium |
| 8 | Phase 4 | Add rate limiting | Medium |
| 9 | Phase 5 | Setup monitoring | Low |

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Cloudflare Workers Security](https://developers.cloudflare.com/workers/learning/security-model/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy Reference](https://content-security-policy.com/)
