/**
 * Clean Architecture Base Controller
 * Provides standardized JSON response helpers
 */
class BaseController {
  sendSuccess(res, data = null, message = 'Operation completed successfully', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      requestId: res.req?.id || null
    });
  }

  sendCreated(res, data = null, message = 'Resource created successfully') {
    return this.sendSuccess(res, data, message, 201);
  }

  sendPaginated(res, data, pagination, message = 'Records retrieved successfully') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
      requestId: res.req?.id || null
    });
  }

  // Wrapper for async route handling to eliminate try/catch boilerplate
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = BaseController;
