const { RateLimitError } = require('../core/errors/app.error');
const { config } = require('../config/env.config');

const requestCounts = new Map();

/**
 * Enterprise In-Memory Rate Limiting Middleware
 */
const rateLimiterMiddleware = (options = {}) => {
  const windowMs = options.windowMs || config.rateLimit.windowMs;
  const maxRequests = options.max || config.rateLimit.max;

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, startTime: now });
      return next();
    }

    const record = requestCounts.get(ip);
    if (now - record.startTime > windowMs) {
      record.count = 1;
      record.startTime = now;
      return next();
    }

    record.count += 1;

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', new Date(record.startTime + windowMs).toISOString());

    if (record.count > maxRequests) {
      throw new RateLimitError(`Rate limit exceeded. Maximum ${maxRequests} requests allowed per ${windowMs / 1000}s.`);
    }

    next();
  };
};

module.exports = rateLimiterMiddleware;
