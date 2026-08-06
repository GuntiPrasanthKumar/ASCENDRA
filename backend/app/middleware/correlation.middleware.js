const { v4: uuidv4 } = require('crypto');
const logger = require('../core/logger/logger');

/**
 * Request Correlation ID & Performance Timing Middleware
 */
const correlationMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.id = correlationId;
  res.setHeader('X-Request-ID', correlationId);

  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      requestId: correlationId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip
    });
  });

  next();
};

module.exports = correlationMiddleware;
