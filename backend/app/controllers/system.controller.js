const BaseController = require('./base.controller');
const { featureFlags } = require('../core/feature-flags/feature.flags');
const { config } = require('../config/env.config');

class SystemController extends BaseController {
  constructor() {
    super();
    this.getFeatureFlags = this.asyncHandler(this.getFeatureFlags.bind(this));
    this.updateFeatureFlag = this.asyncHandler(this.updateFeatureFlag.bind(this));
    this.getSystemInfo = this.asyncHandler(this.getSystemInfo.bind(this));
  }

  async getFeatureFlags(req, res) {
    const flags = featureFlags.getAllFlags();
    return this.sendSuccess(res, { flags }, 'Feature flags retrieved successfully');
  }

  async updateFeatureFlag(req, res) {
    const { flagName, enabled } = req.body;
    featureFlags.setFlag(flagName, enabled);
    return this.sendSuccess(res, { flagName, enabled: featureFlags.isEnabled(flagName) }, `Feature flag '${flagName}' updated successfully`);
  }

  async getSystemInfo(req, res) {
    const info = {
      name: 'ASCENDRA Enterprise Platform',
      environment: config.env,
      version: '1.0.0',
      apiPrefix: config.server.apiPrefix,
      apiVersion: config.server.apiVersion,
      storageDriver: config.storage.driver,
      featureFlags: featureFlags.getAllFlags()
    };
    return this.sendSuccess(res, info, 'System info retrieved successfully');
  }
}

module.exports = new SystemController();
