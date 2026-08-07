const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  getExecutiveSummary, 
  getWeeklyReport, 
  getPredictions, 
  getMastery, 
  getSelfExplainingRecommendations, 
  getMentorDashboard 
} = require('../controllers/insights.controller');

router.get('/summary', protect, getExecutiveSummary);
router.get('/weekly', protect, getWeeklyReport);
router.get('/predictions', protect, getPredictions);
router.get('/mastery', protect, getMastery);
router.get('/recommendations', protect, getSelfExplainingRecommendations);
router.get('/mentor', protect, getMentorDashboard);

module.exports = router;
