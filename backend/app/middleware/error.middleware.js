const logger = require('../core/logger/logger');
const { AppError } = require('../core/errors/app.error');

/**
 * Enterprise Centralized Global Error Architecture Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Wrap Mongoose CastError (Bad ObjectId)
  if (err.name === 'CastError') {
    error = new AppError(`Invalid resource identifier format`, 400, 'INVALID_ID_FORMAT');
  }

  // Wrap Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(', ');
    error = new AppError(`Duplicate entry for unique field(s): ${fields}`, 409, 'DUPLICATE_RESOURCE_KEY');
  }

  // Wrap Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map(val => ({
      field: val.path,
      message: val.message
    }));
    error = new AppError('Mongoose schema validation failed', 400, 'SCHEMA_VALIDATION_ERROR', details);
  }

  const statusCode = error.statusCode || 500;
  const errorCode = error.errorCode || 'INTERNAL_SERVER_ERROR';
  const message = error.message || 'An unexpected internal server error occurred';

  // Log error with structured correlation context
  logger.error(`[API Error] ${req.method} ${req.originalUrl} - ${statusCode} ${message}`, {
    statusCode,
    errorCode,
    requestId: req.id,
    stack: error.stack,
    details: error.details
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: error.details || null,
      timestamp: new Date().toISOString(),
      requestId: req.id || null
    }
  });
};

module.exports = { errorHandler };
