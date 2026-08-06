const { ValidationError } = require('../core/errors/app.error');

/**
 * Lightweight Enterprise DTO Validator
 * Provides declarative schema validation for request payloads
 */
class DtoValidator {
  static validate(data, schema, options = { allowUnknown: true }) {
    const errors = [];
    const sanitized = {};

    for (const [field, rules] of Object.entries(schema)) {
      const val = data[field];

      // Required check
      if (rules.required && (val === undefined || val === null || val === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }

      if (val === undefined || val === null) {
        if (rules.default !== undefined) {
          sanitized[field] = rules.default;
        }
        continue;
      }

      // Type check
      if (rules.type) {
        if (rules.type === 'string' && typeof val !== 'string') {
          errors.push({ field, message: `${field} must be a string` });
        } else if (rules.type === 'number' && typeof val !== 'number') {
          errors.push({ field, message: `${field} must be a number` });
        } else if (rules.type === 'boolean' && typeof val !== 'boolean') {
          errors.push({ field, message: `${field} must be a boolean` });
        } else if (rules.type === 'array' && !Array.isArray(val)) {
          errors.push({ field, message: `${field} must be an array` });
        } else if (rules.type === 'object' && (typeof val !== 'object' || Array.isArray(val))) {
          errors.push({ field, message: `${field} must be an object` });
        }
      }

      // String length constraints
      if (typeof val === 'string') {
        if (rules.minLength && val.length < rules.minLength) {
          errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
        }
        if (rules.maxLength && val.length > rules.maxLength) {
          errors.push({ field, message: `${field} cannot exceed ${rules.maxLength} characters` });
        }
        if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errors.push({ field, message: `${field} must be a valid email address` });
        }
      }

      // Number constraints
      if (typeof val === 'number') {
        if (rules.min !== undefined && val < rules.min) {
          errors.push({ field, message: `${field} must be >= ${rules.min}` });
        }
        if (rules.max !== undefined && val > rules.max) {
          errors.push({ field, message: `${field} must be <= ${rules.max}` });
        }
      }

      sanitized[field] = val;
    }

    if (errors.length > 0) {
      throw new ValidationError('Input validation failed', errors);
    }

    return sanitized;
  }
}

module.exports = DtoValidator;
