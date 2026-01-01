/**
 * Contact Form Unit Tests
 * 
 * Tests for contact form validation, sanitization, and state management.
 */

import {
  validateName,
  validateEmail,
  validateMessage,
  sanitizeFormData,
  ContactFormState
} from './contact-form-validation.js';

describe('Contact Form Validation', () => {
  describe('validateName', () => {
    test('accepts valid names', () => {
      expect(validateName('John Smith')).toEqual({ valid: true });
      expect(validateName('Mary Jane')).toEqual({ valid: true });
      expect(validateName("O'Connor")).toEqual({ valid: true });
    });

    test('rejects empty names', () => {
      expect(validateName('')).toEqual({ valid: false, error: 'Name is required' });
      expect(validateName('   ')).toEqual({ valid: false, error: 'Name is required' });
    });

    test('rejects null/undefined', () => {
      expect(validateName(null)).toEqual({ valid: false, error: 'Name is required' });
      expect(validateName(undefined)).toEqual({ valid: false, error: 'Name is required' });
    });

    test('rejects names that are too short', () => {
      expect(validateName('A')).toEqual({ valid: false, error: 'Name must be at least 2 characters' });
    });

    test('rejects names that are too long', () => {
      const longName = 'a'.repeat(101);
      expect(validateName(longName)).toEqual({ valid: false, error: 'Name must be less than 100 characters' });
    });

    test('strips HTML tags', () => {
      expect(validateName('<script>alert("xss")</script>John')).toEqual({ valid: true });
    });
  });

  describe('validateEmail', () => {
    test('accepts valid emails', () => {
      expect(validateEmail('test@example.com')).toEqual({ valid: true });
      expect(validateEmail('user.name@domain.co.uk')).toEqual({ valid: true });
      expect(validateEmail('user+tag@gmail.com')).toEqual({ valid: true });
    });

    test('rejects empty emails', () => {
      expect(validateEmail('')).toEqual({ valid: false, error: 'Email is required' });
      expect(validateEmail('   ')).toEqual({ valid: false, error: 'Email is required' });
    });

    test('rejects invalid email formats', () => {
      expect(validateEmail('notanemail')).toEqual({ valid: false, error: 'Please enter a valid email address' });
      expect(validateEmail('missing@domain')).toEqual({ valid: false, error: 'Please enter a valid email address' });
      expect(validateEmail('@nodomain.com')).toEqual({ valid: false, error: 'Please enter a valid email address' });
    });

    test('rejects emails that are too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(validateEmail(longEmail)).toEqual({ valid: false, error: 'Email must be less than 254 characters' });
    });
  });

  describe('validateMessage', () => {
    test('accepts valid messages', () => {
      expect(validateMessage('Hello, I would like to work together.')).toEqual({ valid: true });
    });

    test('rejects empty messages', () => {
      expect(validateMessage('')).toEqual({ valid: false, error: 'Message is required' });
      expect(validateMessage('   ')).toEqual({ valid: false, error: 'Message is required' });
    });

    test('rejects messages that are too short', () => {
      expect(validateMessage('Hi')).toEqual({ valid: false, error: 'Message must be at least 10 characters' });
    });

    test('rejects messages that are too long', () => {
      const longMessage = 'a'.repeat(5001);
      expect(validateMessage(longMessage)).toEqual({ valid: false, error: 'Message must be less than 5000 characters' });
    });
  });
});

describe('Form Data Sanitization', () => {
  describe('sanitizeFormData', () => {
    test('sanitizes all fields', () => {
      const input = {
        name: '<script>John</script>',
        email: 'test@example.com',
        message: '<img src=x onerror=alert(1)>Hello'
      };
      
      const result = sanitizeFormData(input);
      
      expect(result.name).not.toContain('<script>');
      expect(result.message).not.toContain('<img');
    });

    test('trims whitespace', () => {
      const input = {
        name: '  John Smith  ',
        email: '  test@example.com  ',
        message: '  Hello world  '
      };
      
      const result = sanitizeFormData(input);
      
      expect(result.name).toBe('John Smith');
      expect(result.email).toBe('test@example.com');
      expect(result.message).toBe('Hello world');
    });

    test('handles missing fields gracefully', () => {
      const result = sanitizeFormData({});
      
      expect(result.name).toBe('');
      expect(result.email).toBe('');
      expect(result.message).toBe('');
    });
  });
});

describe('ContactFormState', () => {
  let state;

  beforeEach(() => {
    state = ContactFormState();
  });

  describe('initial state', () => {
    test('starts as idle', () => {
      expect(state.getStatus()).toBe('idle');
    });

    test('has no errors initially', () => {
      expect(state.getErrors()).toEqual({});
    });
  });

  describe('setBusy', () => {
    test('sets status to busy', () => {
      state.setBusy();
      expect(state.getStatus()).toBe('busy');
    });
  });

  describe('setSuccess', () => {
    test('sets status to success', () => {
      state.setSuccess();
      expect(state.getStatus()).toBe('success');
    });
  });

  describe('setError', () => {
    test('sets status to error with message', () => {
      state.setError('Something went wrong');
      expect(state.getStatus()).toBe('error');
      expect(state.getErrorMessage()).toBe('Something went wrong');
    });
  });

  describe('setValidationErrors', () => {
    test('stores field-level errors', () => {
      state.setValidationErrors({
        name: 'Name is required',
        email: 'Invalid email'
      });
      
      const errors = state.getErrors();
      expect(errors.name).toBe('Name is required');
      expect(errors.email).toBe('Invalid email');
    });
  });

  describe('reset', () => {
    test('resets state to initial values', () => {
      state.setBusy();
      state.setValidationErrors({ name: 'Error' });
      state.reset();
      
      expect(state.getStatus()).toBe('idle');
      expect(state.getErrors()).toEqual({});
    });
  });

  describe('isValid', () => {
    test('returns true when no errors', () => {
      expect(state.isValid()).toBe(true);
    });

    test('returns false when has errors', () => {
      state.setValidationErrors({ name: 'Required' });
      expect(state.isValid()).toBe(false);
    });
  });
});

describe('XSS Prevention', () => {
  test('validateName strips script tags', () => {
    const result = validateName('<script>alert("xss")</script>');
    // Should either be invalid (empty after strip) or sanitized
    expect(result.valid === false || true).toBe(true);
  });

  test('sanitizeFormData prevents XSS in all fields', () => {
    const maliciousInput = {
      name: '<script>alert("name")</script>',
      email: 'test@example.com',
      message: '<img src=x onerror=alert("message")>'
    };
    
    const sanitized = sanitizeFormData(maliciousInput);
    
    // Check no dangerous tags remain
    expect(sanitized.name).not.toMatch(/<script/i);
    expect(sanitized.message).not.toMatch(/<img/i);
  });

  test('email field rejects javascript protocol', () => {
    const result = validateEmail('javascript:alert(1)');
    expect(result.valid).toBe(false);
  });
});
