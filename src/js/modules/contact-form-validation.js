/**
 * Contact Form Validation Module
 * 
 * Provides validation, sanitization, and state management for contact forms.
 * Designed to be testable and reusable.
 */

/**
 * Strips HTML tags from a string.
 * @param {string} str - Input string
 * @returns {string} String with HTML tags removed
 */
function stripTags(str) {
  if (!str) return '';
  // Remove script/style tags and content first
  let result = String(str)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // Then remove all remaining tags
  return result.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validates a name field.
 * @param {string} name - The name to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateName(name) {
  if (name === null || name === undefined) {
    return { valid: false, error: 'Name is required' };
  }
  
  const sanitized = stripTags(String(name)).trim();
  
  if (!sanitized) {
    return { valid: false, error: 'Name is required' };
  }
  
  if (sanitized.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (sanitized.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }
  
  return { valid: true };
}

/**
 * Validates an email field.
 * @param {string} email - The email to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateEmail(email) {
  if (email === null || email === undefined) {
    return { valid: false, error: 'Email is required' };
  }
  
  const trimmed = String(email).trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (trimmed.length > 254) {
    return { valid: false, error: 'Email must be less than 254 characters' };
  }
  
  // Check for dangerous protocols
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  // Basic email format validation
  // This regex handles most common email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  return { valid: true };
}

/**
 * Validates a message field.
 * @param {string} message - The message to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateMessage(message) {
  if (message === null || message === undefined) {
    return { valid: false, error: 'Message is required' };
  }
  
  const trimmed = String(message).trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Message is required' };
  }
  
  if (trimmed.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters' };
  }
  
  if (trimmed.length > 5000) {
    return { valid: false, error: 'Message must be less than 5000 characters' };
  }
  
  return { valid: true };
}

/**
 * Sanitizes form data by stripping HTML and trimming whitespace.
 * @param {Object} data - Form data object with name, email, message
 * @returns {Object} Sanitized form data
 */
export function sanitizeFormData(data) {
  return {
    name: stripTags(data.name || ''),
    email: String(data.email || '').trim(),
    message: stripTags(data.message || '')
  };
}

/**
 * Creates a contact form state manager.
 * @returns {Object} State management object
 */
export function ContactFormState() {
  let status = 'idle'; // 'idle' | 'busy' | 'success' | 'error'
  let errors = {};
  let errorMessage = '';
  
  return {
    getStatus() {
      return status;
    },
    
    getErrors() {
      return { ...errors };
    },
    
    getErrorMessage() {
      return errorMessage;
    },
    
    setBusy() {
      status = 'busy';
      errors = {};
      errorMessage = '';
    },
    
    setSuccess() {
      status = 'success';
      errors = {};
      errorMessage = '';
    },
    
    setError(message) {
      status = 'error';
      errorMessage = message;
    },
    
    setValidationErrors(fieldErrors) {
      errors = { ...fieldErrors };
    },
    
    isValid() {
      return Object.keys(errors).length === 0;
    },
    
    reset() {
      status = 'idle';
      errors = {};
      errorMessage = '';
    }
  };
}

/**
 * Validates all form fields.
 * @param {Object} data - Form data with name, email, message
 * @returns {{valid: boolean, errors: Object}}
 */
export function validateForm(data) {
  const errors = {};
  
  const nameResult = validateName(data.name);
  if (!nameResult.valid) {
    errors.name = nameResult.error;
  }
  
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) {
    errors.email = emailResult.error;
  }
  
  const messageResult = validateMessage(data.message);
  if (!messageResult.valid) {
    errors.message = messageResult.error;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
