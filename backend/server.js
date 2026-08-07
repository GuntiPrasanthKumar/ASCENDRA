const express = require('express');
const cors = require('cors');
const { config } = require('./app/config/env.config');
const { connectDB, databaseInstance } = require('./app/core/database/mongoose.connection');
const logger = require('./app/core/logger/logger');
const correlationMiddleware = require('./app/middleware/correlation.middleware');
const { securityHeadersMiddleware, sanitizeMiddleware } = require('./app/middleware/security.middleware');
const rateLimiterMiddleware = require('./app/middleware/rateLimiter.middleware');
const { errorHandler } = require('./app/middleware/error.middleware');
const { swaggerMiddleware } = require('./app/config/swagger.config');

// Route Imports
const healthRoutes = require('./app/routes/health.routes');
const systemRoutes = require('./app/routes/system.routes');
const authRoutes = require('./app/routes/auth.routes');
const profileRoutes = require('./app/routes/profile.routes');
const learningRoutes = require('./app/routes/learning.routes');
const practiceRoutes = require('./app/routes/practice.routes');
const assessmentRoutes = require('./app/routes/assessment.routes');
const analyticsRoutes = require('./app/routes/analytics.routes');
const leaderboardRoutes = require('./app/routes/leaderboard.routes');
const chatRoutes = require('./app/routes/chat.routes');
const proctorRoutes = require('./app/routes/proctor.routes');
const aiRoutes = require('./app/routes/ai.routes');
const codelabRoutes = require('./app/routes/codelab.routes');
const interviewRoutes = require('./app/routes/interview.routes');
const careerRoutes = require('./app/routes/career.routes');
const insightsRoutes = require('./app/routes/insights.routes');
const notificationRoutes = require('./app/routes/notification.routes');

// Connect to database
connectDB();

const app = express();

// Global Security & Correlation Middlewares
app.use(correlationMiddleware);
app.use(securityHeadersMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(sanitizeMiddleware);

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// Rate Limiter
app.use(rateLimiterMiddleware());

// Health & OpenAPI Specification Endpoints
app.use('/health', healthRoutes);
app.use('/api/docs', swaggerMiddleware);
app.use('/api/docs.json', swaggerMiddleware);

// System & Feature Flags Infrastructure Routes
app.use('/api/v1/system', systemRoutes);

// Business Domain Routes
app.use('/api/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/v1/learning', learningRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/v1/practice', practiceRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/proctor', proctorRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/v1/codelab', codelabRoutes);
app.use('/api/codelab', codelabRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/v1/career', careerRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/v1/insights', insightsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/notifications', notificationRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'ASCENDRA Enterprise Platform API',
    version: '1.0.0',
    status: 'OPERATIONAL',
    docs: '/api/docs',
    health: '/health'
  });
});

// Catch-All 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`,
      timestamp: new Date().toISOString(),
      requestId: req.id || null
    }
  });
});

// Centralized Enterprise Error Architecture Middleware
app.use(errorHandler);

const PORT = config.server.port;

const server = app.listen(PORT, () => {
  logger.info(`ASCENDRA Enterprise API Server initialized on port ${PORT}`, {
    environment: config.env,
    port: PORT
  });
});

// Graceful Shutdown Protocol
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Initiating ASCENDRA Enterprise graceful shutdown protocol...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await databaseInstance.disconnect();
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown initiated due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection detected', { error: err.message, stack: err.stack });
});

module.exports = { app, server };
