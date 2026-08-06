const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');
const { validateRequest } = require('../middleware/validation.middleware');

const flagUpdateSchema = {
  flagName: { required: true, type: 'string' },
  enabled: { required: true, type: 'boolean' }
};

router.get('/flags', systemController.getFeatureFlags);
router.post('/flags', validateRequest(flagUpdateSchema), systemController.updateFeatureFlag);
router.get('/info', systemController.getSystemInfo);

module.exports = router;
