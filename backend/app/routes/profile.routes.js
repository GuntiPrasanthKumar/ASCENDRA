const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updatePreferences, 
  getJourneyTimeline, 
  logActivity, 
  getAchievements, 
  evaluateAchievements, 
  getStatistics, 
  getAiMemory, 
  addAiNote, 
  getRecommendationContext 
} = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const logActivitySchema = {
  module: { required: true, type: 'string' },
  action: { required: true, type: 'string' },
  title: { required: true, type: 'string' }
};

const noteSchema = {
  note: { required: true, type: 'string', minLength: 3 }
};

// All Profile endpoints require JWT protection
router.use(protect);

router.get('/me', getProfile);
router.patch('/preferences', updatePreferences);

// Journey Engine Routes
router.get('/journey', getJourneyTimeline);
router.post('/journey', validateRequest(logActivitySchema), logActivity);

// Achievement Engine Routes
router.get('/achievements', getAchievements);
router.post('/achievements/evaluate', evaluateAchievements);

// Statistics Engine Route
router.get('/statistics', getStatistics);

// AI Memory & Recommendation Source Routes
router.get('/ai-memory', getAiMemory);
router.post('/ai-memory/note', validateRequest(noteSchema), addAiNote);
router.get('/recommendation-context', getRecommendationContext);

module.exports = router;
