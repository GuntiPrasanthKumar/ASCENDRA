const express = require('express');
const {
  getPerformance,
  getSummary,
  getHeatmap
} = require('../controllers/analytics.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/performance', getPerformance);
router.get('/summary', getSummary);
router.get('/heatmap', getHeatmap);

module.exports = router;
