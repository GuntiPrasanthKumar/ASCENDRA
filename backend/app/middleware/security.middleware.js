/**
 * Enterprise Security Headers & Request Sanitization Middleware
 */
const securityHeadersMiddleware = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Enable XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  // Hide powered-by header
  res.removeHeader('X-Powered-By');
  
  next();
};

/**
 * XSS & NoSQL Injection Request Body Sanitizer
 */
const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitizeObject = (obj) => {
      for (const key in obj) {
        if (key.startsWith('$')) {
          delete obj[key]; // Strip MongoDB query operators
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };
    sanitizeObject(req.body);
  }
  next();
};

module.exports = {
  securityHeadersMiddleware,
  sanitizeMiddleware
};
