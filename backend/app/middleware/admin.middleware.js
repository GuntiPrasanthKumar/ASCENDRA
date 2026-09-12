const ResponseFormatter = require('../ai/ResponseFormatter');

exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(ResponseFormatter.formatError('Authentication required', { code: 'UNAUTHORIZED' }));
  }

  const role = (req.user.role || '').toUpperCase();
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return res.status(403).json(ResponseFormatter.formatError('Access denied: Administrator privileges required', { code: 'FORBIDDEN' }));
  }

  next();
};
