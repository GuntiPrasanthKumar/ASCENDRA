const DtoValidator = require('../dtos/validation.dto');

/**
 * Middleware factory for request validation using DtoValidator schemas
 */
const validateRequest = (schema, target = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[target] || {};
      const validatedData = DtoValidator.validate(dataToValidate, schema);
      req[target] = validatedData;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  validateRequest
};
