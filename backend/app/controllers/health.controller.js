const BaseController = require('./base.controller');
const { databaseInstance } = require('../core/database/mongoose.connection');
const { config } = require('../config/env.config');

class HealthController extends BaseController {
  constructor() {
    super();
    this.getHealthStatus = this.asyncHandler(this.getHealthStatus.bind(this));
    this.getLiveness = this.asyncHandler(this.getLiveness.bind(this));
    this.getReadiness = this.asyncHandler(this.getReadiness.bind(this));
  }

  /**
   * Full Enterprise System Health Check
   * GET /health
   */
  async getHealthStatus(req, res) {
    const dbStatus = databaseInstance.getStatus();
    const memoryUsage = process.memoryUsage();
    
    const isHealthy = dbStatus.isConnected || config.isDevelopment || config.isTest;

    const statusReport = {
      status: isHealthy ? 'UP' : 'DOWN',
      environment: config.env,
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: dbStatus,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: {
          rssMB: (memoryUsage.rss / (1024 * 1024)).toFixed(2),
          heapTotalMB: (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2),
          heapUsedMB: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2)
        }
      }
    };

    const statusCode = isHealthy ? 200 : 503;
    return res.status(statusCode).json({
      success: isHealthy,
      data: statusReport
    });
  }

  /**
   * Kubernetes Liveness Probe
   * GET /health/liveness
   */
  async getLiveness(req, res) {
    return this.sendSuccess(res, { status: 'UP', alive: true }, 'Application liveness check passed');
  }

  /**
   * Kubernetes Readiness Probe
   * GET /health/readiness
   */
  async getReadiness(req, res) {
    const dbStatus = databaseInstance.getStatus();
    const isReady = dbStatus.isConnected || config.isDevelopment || config.isTest;

    if (!isReady) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'DATABASE_NOT_READY',
          message: 'MongoDB database is not ready to receive traffic',
          timestamp: new Date().toISOString()
        }
      });
    }

    return this.sendSuccess(res, { status: 'READY', ready: true, database: dbStatus }, 'Application readiness check passed');
  }
}

module.exports = new HealthController();
