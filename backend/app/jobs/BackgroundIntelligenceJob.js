const PlacementWorkflowEngine = require('../services/placement/PlacementWorkflowEngine');
const AIPlannerService = require('../ai/AIPlannerService');
const logger = require('../core/logger/logger');

class BackgroundIntelligenceJob {
  async runDailySync(userId) {
    if (!userId) return null;
    logger.info(`[BackgroundIntelligenceJob] Running background placement sync for user ${userId}`);

    try {
      const [readiness, plan] = await Promise.all([
        PlacementWorkflowEngine.calculatePlacementReadiness(userId),
        AIPlannerService.generateDailyPlan(userId)
      ]);

      return {
        syncedAt: new Date().toISOString(),
        readiness,
        plan
      };
    } catch (err) {
      logger.warn(`[BackgroundIntelligenceJob] Sync warning for ${userId}:`, err.message);
      return null;
    }
  }
}

module.exports = new BackgroundIntelligenceJob();
