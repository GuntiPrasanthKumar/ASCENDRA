const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

router.get('/', healthController.getHealthStatus);
router.get('/liveness', healthController.getLiveness);
router.get('/readiness', healthController.getReadiness);

module.exports = router;
