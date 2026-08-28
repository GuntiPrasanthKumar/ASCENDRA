const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');
const { 
  getGlobalMetrics, 
  getUsers, 
  updateUserRole, 
  getAIConfig, 
  updateAIConfig, 
  getProctorLogs, 
  getAuditLogs, 
  getFeatureFlags, 
  updateFeatureFlags, 
  getSystemHealth 
} = require('../controllers/admin.controller');

router.get('/metrics', protect, requireAdmin, getGlobalMetrics);
router.get('/users', protect, requireAdmin, getUsers);
router.put('/users/:userId/role', protect, requireAdmin, updateUserRole);
router.get('/ai/config', protect, requireAdmin, getAIConfig);
router.put('/ai/config', protect, requireAdmin, updateAIConfig);
router.get('/proctor/logs', protect, requireAdmin, getProctorLogs);
router.get('/audit-logs', protect, requireAdmin, getAuditLogs);
router.get('/feature-flags', protect, requireAdmin, getFeatureFlags);
router.put('/feature-flags', protect, requireAdmin, updateFeatureFlags);
router.get('/system/health', protect, requireAdmin, getSystemHealth);

module.exports = router;
