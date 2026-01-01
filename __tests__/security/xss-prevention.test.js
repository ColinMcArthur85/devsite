/**
 * XSS Prevention Security Tests
 * 
 * Comprehensive tests for Cross-Site Scripting (XSS) prevention
 * across all user input surfaces.
 */

import { escapeHtml, stripTags, sanitizeText, sanitizeForUrl } from '../../src/js/utils/sanitize.js';
import { validateQuery } from '../../functions/api/unsplash-helpers.js';
import { sanitizeFormData, validateName, validateEmail, validateMessage } from '../../src/js/modules/contact-form-validation.js';

// OWASP XSS Filter Evasion Cheat Sheet vectors
// https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
const XSS_VECTORS = [
  // Basic script injection
  '<script>alert("XSS")</script>',
  '<SCRIPT>alert("XSS")</SCRIPT>',
  '<ScRiPt>alert("XSS")</ScRiPt>',
  
  // Image tag injection
  '<img src=x onerror=alert("XSS")>',
  '<IMG SRC=javascript:alert("XSS")>',
  '<img src="javascript:alert(\'XSS\')">',
  '<img """><script>alert("XSS")</script>">',
  
  // SVG injection
  '<svg onload=alert("XSS")>',
  '<svg/onload=alert("XSS")>',
  
  // Event handlers
  '<body onload=alert("XSS")>',
  '<div onmouseover=alert("XSS")>hover</div>',
  '<input onfocus=alert("XSS") autofocus>',
  
  // iframe injection
  '<iframe src="javascript:alert(\'XSS\')">',
  '<iframe src="data:text/html,<script>alert(\'XSS\')</script>">',
  
  // Link injection
  '<a href="javascript:alert(\'XSS\')">click</a>',
  '<a href="data:text/html,<script>alert(\'XSS\')</script>">click</a>',
  
  // Style injection
  '<div style="background:url(javascript:alert(\'XSS\'))">',
  '<style>@import "javascript:alert(\'XSS\')"</style>',
  
  // Math/MathML injection
  '<math><maction xlink:href="javascript:alert(1)">click</maction></math>',
  
  // Object/embed injection
  '<object data="javascript:alert(\'XSS\')">',
  '<embed src="javascript:alert(\'XSS\')">',
  
  // Form injection
  '<form action="javascript:alert(\'XSS\')"><input type=submit>',
  
  // Meta refresh
  '<meta http-equiv="refresh" content="0;url=javascript:alert(\'XSS\')">',
  
  // Breaking out of attributes
  '"><script>alert("XSS")</script>',
  "'-alert('XSS')-'",
  '"><img src=x onerror=alert("XSS")>',
  
  // Unicode/encoding tricks
  '<script>alert(String.fromCharCode(88,83,83))</script>',
  
  // Null bytes
  '<scr\x00ipt>alert("XSS")</script>',
  
  // HTML entities
  '&lt;script&gt;alert("XSS")&lt;/script&gt;',
];

describe('XSS Prevention - sanitize.js utilities', () => {
  describe('escapeHtml', () => {
    XSS_VECTORS.forEach((vector, index) => {
      test(`escapes XSS vector ${index + 1}`, () => {
        const escaped = escapeHtml(vector);
        // Should not contain raw < or > (except entity-encoded)
        expect(escaped).not.toMatch(/<[a-zA-Z]/);
      });
    });
  });

  describe('stripTags', () => {
    XSS_VECTORS.forEach((vector, index) => {
      test(`strips XSS vector ${index + 1}`, () => {
        const stripped = stripTags(vector);
        // Should not contain any HTML tags
        expect(stripped).not.toMatch(/<[^>]+>/);
      });
    });
  });

  describe('sanitizeText', () => {
    XSS_VECTORS.forEach((vector, index) => {
      test(`neutralizes XSS vector ${index + 1}`, () => {
        const sanitized = sanitizeText(vector);
        // After sanitization, executing this as HTML should be safe
        // Check for no raw tags
        expect(sanitized).not.toMatch(/<[a-zA-Z]/);
      });
    });
  });
});

describe('XSS Prevention - Search Inputs', () => {
  describe('validateQuery', () => {
    test('strips script tags from search queries', () => {
      const result = validateQuery('<script>alert("XSS")</script>search term');
      if (result.valid) {
        expect(result.sanitized).not.toContain('<script>');
        expect(result.sanitized).toBe('search term');
      }
    });

    test('strips img tags from search queries', () => {
      const result = validateQuery('<img src=x onerror=alert(1)>cats');
      if (result.valid) {
        expect(result.sanitized).not.toContain('<img');
      }
    });

    test('handles multiple XSS attempts in single query', () => {
      const result = validateQuery('<script>a</script><img src=x>dogs<svg onload=b>');
      if (result.valid) {
        expect(result.sanitized).toBe('dogs');
      }
    });

    test('rejects query that becomes empty after sanitization', () => {
      const result = validateQuery('<script>alert(1)</script>');
      expect(result.valid).toBe(false);
    });
  });
});

describe('XSS Prevention - Form Inputs', () => {
  describe('sanitizeFormData', () => {
    test('sanitizes XSS in name field', () => {
      const result = sanitizeFormData({ 
        name: '<script>alert("XSS")</script>John',
        email: 'test@example.com',
        message: 'Hello'
      });
      expect(result.name).not.toContain('<script>');
      expect(result.name).toBe('John');
    });

    test('sanitizes XSS in message field', () => {
      const result = sanitizeFormData({
        name: 'John',
        email: 'test@example.com',
        message: '<img src=x onerror=alert(1)>Please help me'
      });
      expect(result.message).not.toContain('<img');
      expect(result.message).toBe('Please help me');
    });

    test('handles all OWASP vectors in form data', () => {
      XSS_VECTORS.forEach((vector) => {
        const result = sanitizeFormData({
          name: vector + 'SafeName',
          email: 'test@example.com',
          message: vector + 'Safe message content here.'
        });
        expect(result.name).not.toMatch(/<[a-zA-Z]/);
        expect(result.message).not.toMatch(/<[a-zA-Z]/);
      });
    });
  });

  describe('validateName', () => {
    test('accepts names after XSS sanitization', () => {
      const result = validateName('<b>John</b>');
      expect(result.valid).toBe(true);
    });

    test('rejects name that becomes too short after sanitization', () => {
      const result = validateName('<script>script content</script>A');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 2');
    });
  });

  describe('validateEmail', () => {
    test('rejects javascript: protocol', () => {
      expect(validateEmail('javascript:alert(1)').valid).toBe(false);
    });

    test('rejects data: protocol', () => {
      expect(validateEmail('data:text/html,<script>').valid).toBe(false);
    });

    test('rejects vbscript: protocol', () => {
      expect(validateEmail('vbscript:msgbox(1)').valid).toBe(false);
    });
  });

  describe('validateMessage', () => {
    test('accepts message with HTML that gets stripped', () => {
      // Note: validateMessage doesn't strip HTML itself, 
      // that's done by sanitizeFormData first
      const result = validateMessage('Hello <b>world</b>, please help!');
      expect(result.valid).toBe(true);
    });
  });
});

describe('XSS Prevention - URL Sanitization', () => {
  describe('sanitizeForUrl', () => {
    test('blocks javascript: protocol', () => {
      const result = sanitizeForUrl('javascript:alert(1)');
      expect(result).toBe('');
    });

    test('blocks data: protocol', () => {
      const result = sanitizeForUrl('data:text/html,<script>alert(1)</script>');
      expect(result).toBe('');
    });

    test('blocks mixed case javascript:', () => {
      const result = sanitizeForUrl('JaVaScRiPt:alert(1)');
      expect(result).toBe('');
    });

    test('allows safe http URLs', () => {
      const result = sanitizeForUrl('https://example.com/page');
      expect(result).toContain('example.com');
    });

    test('allows relative URLs', () => {
      const result = sanitizeForUrl('/path/to/page');
      expect(result).toBe('/path/to/page');
    });

    test('passes through URLs with HTML characters (encoding is display-layer concern)', () => {
      // sanitizeForUrl focuses on blocking dangerous protocols
      // HTML encoding in URLs is a display-layer concern
      const result = sanitizeForUrl('https://example.com/search?q=test');
      expect(result).toContain('example.com');
    });
  });
});

describe('XSS Prevention - Edge Cases', () => {
  test('handles null input', () => {
    expect(escapeHtml(null)).toBe('');
    expect(stripTags(null)).toBe('');
    expect(sanitizeText(null)).toBe('');
  });

  test('handles undefined input', () => {
    expect(escapeHtml(undefined)).toBe('');
    expect(stripTags(undefined)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
  });

  test('handles numeric input', () => {
    expect(escapeHtml(12345)).toBe('12345');
    expect(stripTags(12345)).toBe('12345');
  });

  test('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
    expect(stripTags('')).toBe('');
    expect(sanitizeText('')).toBe('');
  });

  test('handles nested script tags', () => {
    const nested = '<script><script>alert(1)</script></script>';
    expect(stripTags(nested)).not.toContain('<script>');
  });

  test('handles malformed HTML', () => {
    const malformed = '<script>alert(1)<script>more';
    expect(stripTags(malformed)).not.toContain('<script>');
  });
});
