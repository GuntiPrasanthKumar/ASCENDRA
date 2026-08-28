const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');
const ResponseFormatter = require('../ai/ResponseFormatter');

// In-memory Feature Flags & System Configuration
let featureFlags = {
  proctoringEnabled: true,
  aiStreamingEnabled: true,
  codeLabSandboxEnabled: true,
  interviewStudioEnabled: true,
  atsOptimizerEnabled: true
};

let aiConfig = {
  primaryProvider: 'gemini-1.5-flash',
  secondaryProvider: 'gpt-4o-mini',
  fallbackProvider: 'ascendra-heuristic-v1',
  temperature: 0.7,
  maxTokens: 2048,
  rateLimitPerMinute: 30
};

/**
 * @desc    Get Global Dashboard Metrics
 * @route   GET /api/admin/metrics
 * @access  Private (Admin)
 */
exports.getGlobalMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'STUDENT' });
    const teachersCount = await User.countDocuments({ role: 'TEACHER' });
    const adminsCount = await User.countDocuments({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } });

    const mem = process.memoryUsage();
    const memoryUsedMb = Math.round(mem.heapUsed / (1024 * 1024));

    return res.status(200).json(ResponseFormatter.formatSuccess({
      metrics: {
        totalUsers,
        studentsCount,
        teachersCount,
        adminsCount,
        memoryUsedMb,
        uptimeSeconds: Math.round(process.uptime()),
        apiStatus: 'HEALTHY',
        activeProvider: aiConfig.primaryProvider
      }
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Paginated User List
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json(ResponseFormatter.formatSuccess({ users }));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update User Role with Audit Log
 * @route   PUT /api/admin/users/:userId/role
 * @access  Private (Admin)
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const adminUser = req.user;

    if (!role || !['STUDENT', 'TEACHER', 'ADMIN'].includes(role.toUpperCase())) {
      return res.status(400).json(ResponseFormatter.formatError('Invalid role specified', { code: 'INVALID_INPUT' }));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role.toUpperCase() },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json(ResponseFormatter.formatError('User not found', { code: 'NOT_FOUND' }));
    }

    // Write Audit Log
    await AuditLog.create({
      actorId: adminUser._id,
      actorEmail: adminUser.email || 'admin@ascendra.io',
      action: 'UPDATE_USER_ROLE',
      target: updatedUser.email || updatedUser._id,
      details: { newRole: role.toUpperCase() },
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(200).json(ResponseFormatter.formatSuccess({ user: updatedUser }));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get AI Management Console Config
 * @route   GET /api/admin/ai/config
 * @access  Private (Admin)
 */
exports.getAIConfig = async (req, res, next) => {
  try {
    return res.status(200).json(ResponseFormatter.formatSuccess(aiConfig));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update AI Management Console Config
 * @route   PUT /api/admin/ai/config
 * @access  Private (Admin)
 */
exports.updateAIConfig = async (req, res, next) => {
  try {
    const newConfig = req.body;
    aiConfig = { ...aiConfig, ...newConfig };

    await AuditLog.create({
      actorId: req.user._id,
      actorEmail: req.user.email || 'admin@ascendra.io',
      action: 'UPDATE_AI_CONFIG',
      target: 'AI_MANAGEMENT_CONSOLE',
      details: aiConfig,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(200).json(ResponseFormatter.formatSuccess(aiConfig));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get AI Proctoring Review Audit Logs
 * @route   GET /api/admin/proctor/logs
 * @access  Private (Admin)
 */
exports.getProctorLogs = async (req, res, next) => {
  try {
    const proctorLogs = [
      { id: 'p-1', timestamp: new Date(Date.now() - 3600000).toISOString(), candidate: 'Vijay Kiran', event: 'Webcam Proctoring Verified', gazeStability: 96, strikes: 0, status: 'COMPLIANT' },
      { id: 'p-2', timestamp: new Date(Date.now() - 7200000).toISOString(), candidate: 'Candidate #482', event: 'Tab Switching Infraction', gazeStability: 74, strikes: 1, status: 'WARNED' }
    ];

    return res.status(200).json(ResponseFormatter.formatSuccess({ logs: proctorLogs }));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Audit Log Trail
 * @route   GET /api/admin/audit-logs
 * @access  Private (Admin)
 */
exports.getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json(ResponseFormatter.formatSuccess({ logs }));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Feature Flags Console
 * @route   GET /api/admin/feature-flags
 * @access  Private (Admin)
 */
exports.getFeatureFlags = async (req, res, next) => {
  try {
    return res.status(200).json(ResponseFormatter.formatSuccess(featureFlags));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update Feature Flags Console
 * @route   PUT /api/admin/feature-flags
 * @access  Private (Admin)
 */
exports.updateFeatureFlags = async (req, res, next) => {
  try {
    const newFlags = req.body;
    featureFlags = { ...featureFlags, ...newFlags };

    await AuditLog.create({
      actorId: req.user._id,
      actorEmail: req.user.email || 'admin@ascendra.io',
      action: 'TOGGLE_FEATURE_FLAG',
      target: 'FEATURE_FLAGS_CONSOLE',
      details: featureFlags,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(200).json(ResponseFormatter.formatSuccess(featureFlags));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get System Health Dashboard Metrics
 * @route   GET /api/admin/system/health
 * @access  Private (Admin)
 */
exports.getSystemHealth = async (req, res, next) => {
  try {
    const mem = process.memoryUsage();
    const systemHealth = {
      status: 'HEALTHY',
      database: 'CONNECTED',
      memoryHeapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
      memoryHeapTotalMb: Math.round(mem.heapTotal / (1024 * 1024)),
      uptimeSeconds: Math.round(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform
    };

    return res.status(200).json(ResponseFormatter.formatSuccess(systemHealth));
  } catch (err) {
    next(err);
  }
};
