const { config } = require('../../config/env.config');
const logger = require('../logger/logger');
const { eventBus, DOMAIN_EVENTS } = require('../events/event.bus');

class FeatureFlagService {
  constructor() {
    this.flags = new Map([
      ['aiProctoring', config.featureFlags?.enableAiProctoring ?? true],
      ['codeLabMonaco', config.featureFlags?.enableCodeLabMonaco ?? true],
      ['liveAudio', config.featureFlags?.enableLiveAudio ?? true],
      ['swaggerDocs', config.featureFlags?.enableSwaggerDocs ?? true],
      ['betaAnalytics', false],
    ]);
  }

  isEnabled(flagName) {
    return this.flags.get(flagName) === true;
  }

  setFlag(flagName, enabled) {
    const previous = this.flags.get(flagName);
    this.flags.set(flagName, Boolean(enabled));
    logger.info(`[FeatureFlagService] Flag updated: ${flagName} = ${enabled}`);
    
    eventBus.publish(DOMAIN_EVENTS.FEATURE_FLAG_UPDATED, {
      flagName,
      previous,
      current: Boolean(enabled)
    });
  }

  getAllFlags() {
    return Object.fromEntries(this.flags);
  }

  middleware(flagName) {
    return (req, res, next) => {
      if (!this.isEnabled(flagName)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: `Feature flag '${flagName}' is disabled in current configuration.`,
            timestamp: new Date().toISOString()
          }
        });
      }
      next();
    };
  }
}

const featureFlags = new FeatureFlagService();
module.exports = {
  featureFlags,
  FeatureFlagService
};
